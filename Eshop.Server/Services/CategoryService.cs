using Eshop.Server.Data;
using Eshop.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Eshop.Server.Services
{
    public class CategoryService
    {
        private readonly AppDbContext dbContext;
        public CategoryService(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await dbContext.Categories.ToListAsync();
        }
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await dbContext.Categories.FindAsync(id);
        }
    }
}
