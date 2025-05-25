using Eshop.Server.Models;
using Eshop.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Eshop.Server.Models.DTO;

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

        [HttpGet]
        [Route("getPagedModeratorsOfSupplier")]
        public async Task<IActionResult> GetPagedModeratorsOfSupplier([FromQuery] int supplierId, [FromQuery] int startIdx, [FromQuery] int endIdx)
        {
            List<User> moderators = await supplierService.GetModeratorsOfSupplier(supplierId);
            if (startIdx >= moderators.Count || endIdx < startIdx)
                return BadRequest();

            int totalModeratorsCount = moderators.Count;
            moderators = moderators.Slice(startIdx, endIdx);
            var response = new Dictionary<string, object>()
            {
                {"items", moderators},
                {"total", totalModeratorsCount}
            };

            return Ok(response);
        }

        [HttpPost]
        [Route("addModerator")]
        public async Task<IActionResult> addModerator([FromBody] AddModeratorRequest AddModeratorRequest)
        {
            Boolean success = await supplierService.addModerator(AddModeratorRequest.SupplierId, AddModeratorRequest.ModeratorUserId);
            if (!success)
                return NotFound();
            return Ok();
        }
    }
}
