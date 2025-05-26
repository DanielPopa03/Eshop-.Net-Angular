using Eshop.Server.Data;
using Eshop.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eshop.Server.Services
{
    public class ProductService
    {
        private readonly AppDbContext context;

        public ProductService(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Product?> AddProduct(Product NewProduct)
        {
            var entry = await context.Products.AddAsync(NewProduct);
            await context.SaveChangesAsync();
            return entry.Entity;
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
