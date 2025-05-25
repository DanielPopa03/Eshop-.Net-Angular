using Eshop.Server.Models;
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
    }
}
