using Eshop.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Eshop.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService categoryService;
        public CategoryController(CategoryService categoryService)
        {
            this.categoryService = categoryService;
        }

        [HttpGet]
        [Route("getAllCategories")]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await categoryService.GetAllCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to get categories: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpGet]
        [Route("getCategoryById")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            try
            {
                var category = await categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                    return NotFound("Category not found.");

                return Ok(category);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to get category: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
