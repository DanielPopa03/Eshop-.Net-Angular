using Eshop.Server.Data;
using Eshop.Server.Models;
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

            context.ProductImages.RemoveRange(product.Images);
            context.Products.Remove(product);

            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddReview(Review Review)
        {
            var ProductExists = await context.Products.AnyAsync(p => p.Id == Review.ProductId);
            if (ProductExists)
            {
                await context.Reviews.AddAsync(Review);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
