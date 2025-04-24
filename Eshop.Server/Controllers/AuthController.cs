using Eshop.Server.Models;
using Eshop.Server.Models.DTO;
using Eshop.Server.Services;
using Eshop.Server.Services.Auth;
using Microsoft.AspNetCore.Mvc;

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
    }
}
