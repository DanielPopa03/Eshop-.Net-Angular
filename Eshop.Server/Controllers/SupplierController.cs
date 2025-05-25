using Eshop.Server.Models;
using Eshop.Server.Services;
using Eshop.Server.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Eshop.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SupplierController : ControllerBase
    {
        private readonly SupplierService supplierService;

        public SupplierController(SupplierService supplierService)
        {
            this.supplierService = supplierService;
        }


        [Authorize]
        [HttpGet]
        [Route("getAllSuppliers")]
        public async Task<IActionResult> GetAllSuppliers()
        {
            try
            {
                var suppliers = await supplierService.GetAllSuppliersAsync();
                return Ok(suppliers);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to get suppliers: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        [Route("getUserSuppliers")]
        public async Task<IActionResult> GetUserSuppliers()
        {
            var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;

            if (email == null)
                return Unauthorized("No email claim found.");

            var suppliers = await supplierService.GetUserSuppliersByEmailAsync(email);
            return Ok(suppliers);
        }
    }
}
