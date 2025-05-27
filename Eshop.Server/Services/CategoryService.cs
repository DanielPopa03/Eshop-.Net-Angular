using Eshop.Server.Data;
using Eshop.Server.Models;
using Eshop.Server.Models.DTO;
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
            return await dbContext.Categories.Include(cat => cat.Attributes).ToListAsync();
        }
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await dbContext.Categories
            .Include(cat => cat.Attributes)
            .FirstOrDefaultAsync(cat => cat.CategoryId == id);
        }

        public async Task<Category> AddCategoryAsync(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Attributes = dto.Attributes.Select(attr => new AttributeCat
                {
                    Name = attr.Name,
                    TypeOfFilter = attr.TypeOfFilter
                }).ToList()
            };

            dbContext.Categories.Add(category);
            await dbContext.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> UpdateCategoryAsync(int categoryId, CreateCategoryDto dto)
        {
            var category = await dbContext.Categories
                .Include(c => c.Attributes)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            if (category == null) return null;

            category.Name = dto.Name;

            dbContext.AttributeCats.RemoveRange(category.Attributes);

            category.Attributes = dto.Attributes.Select(attr => new AttributeCat
            {
                Name = attr.Name,
                TypeOfFilter = attr.TypeOfFilter,
                CategoryId = category.CategoryId
            }).ToList();

            await dbContext.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            var category = await dbContext.Categories
                .Include(c => c.Attributes)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            if (category == null) return false;

            dbContext.Categories.Remove(category);
            await dbContext.SaveChangesAsync();
            return true;
        }
    }
}
