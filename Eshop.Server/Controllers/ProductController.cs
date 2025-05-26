using Eshop.Server.Migrations;
using Eshop.Server.Models;
using Eshop.Server.Models.DTO;
using Eshop.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eshop.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService productService;
        private readonly ProductImageService productImageService;
        public ProductController(ProductService productService, ProductImageService productImageService)
        {
            this.productService = productService;
            this.productImageService = productImageService;
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpPost]
        [Route("AddProduct")]
        public async Task<IActionResult> AddProduct([FromForm] ProductUploadDto dto, [FromForm] List<IFormFile> productImages)
        {
            try
            {
                var newProduct = new Product
                {
                    SupplierId = dto.SupplierId,
                    CategoryId = dto.CategoryId,
                    Stock = dto.Stock,
                    Name = dto.Name,
                    Description = dto.Description,
                    Price = dto.Price
                };

                var product = await productService.AddProductAsync(newProduct);
                System.Diagnostics.Debug.WriteLine(product.Id);
                await productImageService.SaveImagesAsync(product.Id, productImages);

                return Ok(product);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to add product: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        [Route("GetPagedProductsOfSupplier")]
        public async Task<IActionResult> GetPagedProductsOfSupplier(
        [FromQuery] int supplierId,
        [FromQuery] int pageIndex,
        [FromQuery] int pageSize)
        {
            try
            {
                var (items, totalPages) = await productService.GetPagedProductsOfSupplierAsync(supplierId, pageIndex-1, pageSize);

                return Ok(new { items, totalPages });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to fetch products: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }

        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpPost]
        [Route("UpdateProduct")]
        public async Task<IActionResult> UpdateProduct(
        [FromForm] ProductDto updatedProduct,
        [FromForm] List<IFormFile>? productImages,
        [FromForm] List<String>? deleteImgByUrl)
        {
            try
            {
                await productService.UpdateProductAsync(updatedProduct.toProduct(), deleteImgByUrl, productImages);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to update product: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin,Moderator")]
        [HttpDelete]
        [Route("DeleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var success = await productService.DeleteProductAsync(id);
                if (!success)
                    return NotFound("Product not found");

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to update product: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("SubmitReview")]
        public async Task<IActionResult> SubmitReview([FromBody] NewReviewDto NewReviewDto)
        {
            try
            {
                if (NewReviewDto.Rating <= 0 || NewReviewDto.Rating > 5)
                    return BadRequest("Rating is not between 1 and 5");

                Review ToBeAddedReview = new Review();
                ToBeAddedReview.ProductId = NewReviewDto.ProductId;
                ToBeAddedReview.Text = NewReviewDto.Text;
                ToBeAddedReview.Rating = NewReviewDto.Rating;

                bool success = await productService.AddReview(ToBeAddedReview);
                if (!success)
                    return NotFound("ProductId is likely to be invalid.");
                else
                    return Ok();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to add product: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
