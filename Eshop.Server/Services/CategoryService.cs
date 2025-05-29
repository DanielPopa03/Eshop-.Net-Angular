using Eshop.Server.Data;
using Eshop.Server.Models;
using Eshop.Server.Models.DTO;
using Microsoft.EntityFrameworkCore;
using System;

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

            var attributeIds = category.Attributes.Select(a => a.Id).ToList();

            var productAttributesToDelete = dbContext.ProductAttributes
                .Where(pa => attributeIds.Contains(pa.AttributeId));
            dbContext.ProductAttributes.RemoveRange(productAttributesToDelete);

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

        public async Task<List<FilterValuesForAttributes>> GetValuesForAttributes(List<int> attributeIds)
        {
            var result = new List<FilterValuesForAttributes>();

            foreach (var attrId in attributeIds)
            {
                var attribute = await dbContext.AttributeCats
                    .AsNoTracking()
                    .FirstOrDefaultAsync(a => a.Id == attrId);

                if (attribute == null) continue;

                if (attribute.TypeOfFilter == "Range")
                {
                    var values = await dbContext.ProductAttributes
                        .Where(pa => pa.AttributeId == attrId)
                        .Select(pa => pa.Value)
                        .ToListAsync();

                    var numericValues = values
                        .Select(v => int.TryParse(v, out var n) ? (int?)n : null)
                        .Where(v => v.HasValue)
                        .Select(v => v.Value)
                        .ToList();

                    if (numericValues.Any())
                    {
                        result.Add(new FilterValuesForAttributes
                        {
                            AttributeId = attrId,
                            Values = new List<string>
                    {
                        numericValues.Min().ToString(),
                        numericValues.Max().ToString()
                    }
                        });
                    }
                }
                else if (attribute.TypeOfFilter == "Dropdown" || attribute.TypeOfFilter == "Search-Dropdown")
                {
                    var values = await dbContext.ProductAttributes
                        .Where(pa => pa.AttributeId == attrId)
                        .Select(pa => pa.Value)
                        .Distinct()
                        .ToListAsync();

                    result.Add(new FilterValuesForAttributes
                    {
                        AttributeId = attrId,
                        Values = values
                    });
                }
            }

            return result;
        }
    }
}
