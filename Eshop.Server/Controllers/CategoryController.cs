using Eshop.Server.Models;
using Eshop.Server.Models.DTO;
using Eshop.Server.Services;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("AddCategory")]
        public async Task<IActionResult> AddCategory([FromBody] CreateCategoryDto category)
        {
            if (category == null)
                return BadRequest("Category cannot be null.");
            try
            {
                // Assuming you have a method to add a category in the service
                var addedCategory = await categoryService.AddCategoryAsync(category);
                return CreatedAtAction(nameof(GetCategoryById), new { id = addedCategory.CategoryId }, addedCategory);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to add category: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("UpdateCategory/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto dto)
        {
            try
            {
                var updated = await categoryService.UpdateCategoryAsync(id, dto);
                if (updated == null) return NotFound("Category not found.");
                return Ok(updated);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to update category: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("DeleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var deleted = await categoryService.DeleteCategoryAsync(id);
                if (!deleted) return NotFound("Category not found.");
                return Ok();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to delete category: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Route("GetValuesForAttributes")]
        public async Task<IActionResult> GetValuesForAttributes([FromBody] List<int> AttributeIds)
        {
            try
            {
                var arrVal = await categoryService.GetValuesForAttributes(AttributeIds);
                return Ok(arrVal);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to delete category: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
