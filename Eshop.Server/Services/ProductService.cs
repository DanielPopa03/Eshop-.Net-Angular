using Eshop.Server.Data;
using Eshop.Server.Models;

namespace Eshop.Server.Services
{
    public class ProductService
    {
        private readonly AppDbContext context;

        public ProductService(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Product?> AddProduct(Product newProduct)
        {
            var entry = await context.Products.AddAsync(newProduct);
            await context.SaveChangesAsync();
            return entry.Entity;
        }
    }
}
