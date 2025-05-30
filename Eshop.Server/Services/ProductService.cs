using Eshop.Server.Data;
using Eshop.Server.Models;
using Eshop.Server.Models.DTO;
using Eshop.Server.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using System.Linq;

namespace Eshop.Server.Services
{
    public class ProductService
    {
        private readonly AppDbContext context;
        private readonly IWebHostEnvironment env;
        private readonly ProductImageService productImageService;

        public ProductService(AppDbContext context, IWebHostEnvironment env,
            ProductImageService productImageService)
        {
            this.context = context;
            this.env = env;
            this.productImageService = productImageService;
        }

        public async Task<Product> AddProductAsync(Product newProduct)
        {
            var attributeValues = newProduct.Attributes?.ToList();
            newProduct.Attributes = null;

            var entry = await context.Products.AddAsync(newProduct);
            await context.SaveChangesAsync();

            if (attributeValues != null)
            {
                foreach (var attr in attributeValues)
                {
                    attr.ProductId = newProduct.Id; 
                }
                await context.ProductAttributes.AddRangeAsync(attributeValues);
                await context.SaveChangesAsync();
            }
            newProduct.Attributes = attributeValues;

            return newProduct;
        }

        public async Task<(List<Product> Items, int TotalPages)> GetPagedFilteredProducts(FilterParamDto dto)
        {
            var query = context.Products
                .Include(p => p.Images)
                .Include(p => p.Attributes)
                .ThenInclude(a => a.Attribute)
                .AsQueryable();

            // Filter by Category
            if (dto.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == dto.CategoryId.Value);
            }

            // Apply Attribute Filters
            if (!dto.Filters.IsNullOrEmpty())
            {
                foreach (var filter in dto.Filters)
                {
                    var attrId = filter.AttributeId;
                    var filterValues = filter.Values?.Select(v => v.ToLower()).ToList();

                    if (filterValues == null || filterValues.Count == 0)
                        continue;

                    query = query.Where(p => p.Attributes.Any(attr =>
                        attr.AttributeId == attrId &&
                        (
                            (attr.Attribute.TypeOfFilter == "Range" &&
                             filterValues.Count == 2 &&
                             attr.Value != null &&
                             filterValues[0] != null &&
                             filterValues[1] != null &&
                             string.Compare(attr.Value, filterValues[0]) >= 0 &&
                             string.Compare(attr.Value, filterValues[1]) <= 0) ||

                            ((attr.Attribute.TypeOfFilter == "Search-Dropdown" || attr.Attribute.TypeOfFilter == "Dropdown") &&
                             filterValues.Contains(attr.Value.ToLower())) ||

                            (attr.Attribute.TypeOfFilter == "Boolean" &&
                             filterValues.Contains("true") && attr.Value.ToLower() == "true")
                        )
                    ));
                }
            }


            // Apply Price Filter
            if (!string.IsNullOrEmpty(dto.PriceFilter) && dto.PriceFilter.Contains("-"))
            {
                var parts = dto.PriceFilter.Split('-');
                if (int.TryParse(parts[0], out int min) && int.TryParse(parts[1], out int max))
                {
                    query = query.Where(p => p.Price >= min && p.Price <= max);
                }
            }

            // Apply Stock Filter
            if (!string.IsNullOrEmpty(dto.StockFilter) && int.TryParse(dto.StockFilter, out int stockMin))
            {
                query = query.Where(p => p.Stock >= stockMin);
            }

            // Apply Sorting
            if (dto.OrderBy?.ToUpper() == "ASC")
                query = query.OrderBy(p => p.Price);
            else if (dto.OrderBy?.ToUpper() == "DES")
                query = query.OrderByDescending(p => p.Price);

            // Total Count for pagination
            int totalItems = await query.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)dto.PageSize);

            // Pagination
            var items = await query
                .Skip((dto.PageIndex - 1) * dto.PageSize)
                .Take(dto.PageSize)
                .ToListAsync();

            return (items, totalPages);
        }

        private bool IsInRange(string attrValue, string filterRange)
        {
            if (!filterRange.Contains("-")) return false;

            var parts = filterRange.Split('-');
            if (parts.Length != 2) return false;

            if (int.TryParse(attrValue, out int actual) &&
                int.TryParse(parts[0], out int min) &&
                int.TryParse(parts[1], out int max))
            {
                return actual >= min && actual <= max;
            }
            return false;
        }

        public async Task<(List<Product> Items, int TotalPages)> GetPagedProductsOfSupplierAsync(int supplierId, int pageIndex, int pageSize)
        {
            var totalCount = await context.Products
                .Where(p => p.SupplierId == supplierId)
                .CountAsync();

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var products = await context.Products
                .Include(p => p.Images)
                .Include(p => p.Attributes)
                .Where(p => p.SupplierId == supplierId)
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (products, totalPages);
        }

        public async Task UpdateProductAsync(Product updatedProduct, List<String>? deleteImgByUrl = null, List<IFormFile>? newImages = null)
        {
            var existing = await context.Products
                .Include(p => p.Images)
                .Include(p => p.Attributes)
                .FirstOrDefaultAsync(p => p.Id == updatedProduct.Id);

            if (existing == null) throw new Exception("Product not found");

            existing.Name = updatedProduct.Name;
            existing.Description = updatedProduct.Description;
            existing.Price = updatedProduct.Price;
            existing.Stock = updatedProduct.Stock;
            existing.CategoryId = updatedProduct.CategoryId;

            existing.Attributes.Clear();
            existing.Attributes = updatedProduct.Attributes.Select(a => new ProductAttribute
            {
                ProductId = updatedProduct.Id,
                AttributeId = a.AttributeId,
                Value = a.Value
            }).ToList();

            if (!deleteImgByUrl.IsNullOrEmpty())
            {
                var imagesToDelete = context.ProductImages
                    .Where(pi => deleteImgByUrl.Contains(pi.ImageUrl))
                    .ToList();

                foreach (var item in imagesToDelete)
                {
                    var filePath = Path.Combine(env.WebRootPath, item.ImageUrl.TrimStart('/'));
                    if (File.Exists(filePath))
                    {
                        try
                        {
                            File.Delete(filePath);
                        }
                        catch (IOException ex)
                        {
                            Console.WriteLine("Could not delete file: " + ex.Message);
                        }
                    }

                }

                context.ProductImages.RemoveRange(imagesToDelete);
                context.SaveChanges();
            }

            if (newImages != null && newImages.Count > 0)
            {
                await productImageService.SaveImagesAsync(existing.Id, newImages);
            }

            await context.SaveChangesAsync();
        }

        public async Task<bool> DeleteProductAsync(int productId)
        {
            var product = await context.Products
                .Include(p => p.Attributes)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
                return false;

            foreach (var image in product.Images)
            {
                var filePath = Path.Combine(env.WebRootPath, image.ImageUrl.TrimStart('/'));
                try
                {
                    File.Delete(filePath);
                }
                catch (IOException ex)
                {
                    Console.WriteLine("Could not delete file: " + ex.Message);
                }
            }

            context.ProductAttributes.RemoveRange(product.Attributes);
            context.ProductImages.RemoveRange(product.Images);
            context.Products.Remove(product);

            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddReview(Review Review)
        {
            var ProductExists = await context.Products.AnyAsync(p => p.Id == Review.ProductId);
            var UserExists = await context.Users.AnyAsync(u => u.Id == Review.UserId);

            if (!ProductExists)
                Console.WriteLine("Product not found: " + Review.ProductId);

            if (!UserExists)
                Console.WriteLine("User not found: " + Review.UserId);


            if (ProductExists && UserExists)
            {
                await context.Reviews.AddAsync(Review);
                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }


        public async Task<Product?> GetProduct(int productId)
        {
            return await context.Products
                .Include(p => p.Images)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.Id == productId);
        }

        public async Task<bool> CheckoutBasket(BasketCheckoutDto Basket)
        {
            Order order = new Order(Basket); /// takes client and address info

            foreach (BoughtItemDto boughtItem in Basket.boughtItems)
            {
                if (boughtItem.Quantity <= 0)
                {
                    context.ChangeTracker.Clear();
                    throw new Exception("Invalid -- negative -- quantity for product");
                }

                Product? product = await context.Products.FindAsync(boughtItem.ProductId);

                if(product == null)
                {
                    context.ChangeTracker.Clear();
                    throw new ProductNotFoundException(boughtItem.ProductId);
                }

                if(product.Stock < boughtItem.Quantity)
                {
                    context.ChangeTracker.Clear();
                    throw new NotEnoughStockException(product.Name);
                }
                
                product.Stock -= (uint)boughtItem.Quantity;

                OrderedProduct orderedProduct = new OrderedProduct();
                orderedProduct.ProductId = boughtItem.ProductId;
                orderedProduct.Quantity = (uint)boughtItem.Quantity;
                orderedProduct.Order = order;
                context.OrderedProducts.Add(orderedProduct);
            }
            await context.SaveChangesAsync();
            return true;
        }
        public async Task<List<Product>> GetBestSoldProductsByCategory()
        {
            // Step 1: Get best sold product IDs per category
            var bestSoldIds = await context.Products
                .Select(p => new
                {
                    p.CategoryId,
                    p.Id,
                    TotalSold = p.OrderedProducts.Sum(op => (int?)op.Quantity) ?? 0
                })
                .GroupBy(x => x.CategoryId)
                .Select(g => g
                    .OrderByDescending(x => x.TotalSold)
                    .Select(x => x.Id)
                    .FirstOrDefault())
                .ToListAsync();

            // Step 2: Fetch full product entities with includes (including Category)
            var bestSoldProducts = await context.Products
                .Where(p => bestSoldIds.Contains(p.Id))
                .Include(p => p.Images)
                .Include(p => p.OrderedProducts)
                .Include(p => p.Category) // <-- Include the category here
                .ToListAsync();

            return bestSoldProducts;
        }


    }
}
