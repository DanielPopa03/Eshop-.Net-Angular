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
        public ProductController(ProductService productService)
        {
            this.productService = productService;
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpGet]
        [Route("AddProduct")]
        public IActionResult AddProduct(Product newProduct)
        {
            try
            {
                var product = productService.AddProduct(newProduct);
                return Ok(product);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to add product: {ex.Message}");
                return StatusCode(500, "Internal server error");
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
            catch(Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to add product: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
