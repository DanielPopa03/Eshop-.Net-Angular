using Eshop.Server.Data;
using Eshop.Server.Models;
using Eshop.Server.Models.DTO;
using Eshop.Server.Services;
using Eshop.Server.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eshop.Server.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService authService;
        private readonly UserService userService;
        public AuthController(UserService userService, AuthService authService)
        {
            this.authService = authService;
            this.userService = userService;
        }

        [HttpPost]
        [Route("/login")]
        public IActionResult login([FromBody] LoginDto dto)
        {
            User user = this.userService.GetUserByEmail(dto.Email);
            if (user != null)
            {
                if (string.IsNullOrEmpty(dto.Password) || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                {
                    return Unauthorized(); 
                }
                return Ok(new { Token = this.authService.GenerateJwtToken(user) });
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        [Route("/request-password-reset")]
        public async Task<IActionResult> RequestReset([FromBody] string email)
        {
            var user = await this.userService.GetUserByEmailAsync(email);
            if (user == null)
                return NotFound("User not found.");

            var token = await this.authService.CreateResetTokenAsync(email);
            var resetLink = $"https://localhost:50969/reset-password?token={token}";
            this.authService.SendPasswordResetEmail(email, resetLink);

            return Ok("Password reset email sent.");
        }

        [HttpPost]
        [Route("/reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            var result = await this.authService.ResetPasswordAsync(dto.Token, hashedPassword);

            if (!result)
                return BadRequest("Invalid or expired token.");

            return Ok("Password has been reset.");
        }


    }
}
