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


        [Authorize(Roles = "Admin")]
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
            var moderators = await supplierService.GetModeratorsOfSupplier(supplierId);
            if (moderators == null || moderators.Count == 0)
            {
                return Ok(new
                {
                    items = new List<User>(),
                    total = 0
                });
            }

            if (startIdx >= moderators.Count || endIdx < startIdx)
                return BadRequest();

            var totalModeratorsCount = moderators.Count;
            if (moderators.Count < endIdx)
                endIdx = moderators.Count;

            if (endIdx < startIdx)
                return NotFound();

            var paged = moderators.Slice(startIdx, endIdx);
            List<UserInfoDto> pagedUserInfo = new List<UserInfoDto>();
            foreach(var mod in paged)
                pagedUserInfo.Add(new UserInfoDto(mod));

            Console.WriteLine(pagedUserInfo);
            
            return Ok(new
            {
                items = pagedUserInfo,
                total = totalModeratorsCount
            });
        }


        [HttpPost]
        [Route("addModerator")]
        public async Task<IActionResult> addModerator([FromBody] ModeratorRequestDto AddModeratorRequest)
        {
            Console.WriteLine("New moderator !!!");
            Boolean success = await supplierService.AddModerator(AddModeratorRequest.SupplierId, AddModeratorRequest.ModeratorUserId);
            if (!success)
                return NotFound();
            return Ok();
        }

        [HttpPost]
        [Route("removeModerator")]
        public async Task<IActionResult> removeModerator([FromBody] ModeratorRequestDto RemoveModeratorRequest)
        {
            Console.WriteLine("Removing Moderator " + RemoveModeratorRequest.SupplierId + " " + RemoveModeratorRequest.ModeratorUserId);
            Boolean success = await supplierService.RemoveModerator(RemoveModeratorRequest.SupplierId, RemoveModeratorRequest.ModeratorUserId);
            if (!success)
                return NotFound();
            return Ok();
        }
    }
}
