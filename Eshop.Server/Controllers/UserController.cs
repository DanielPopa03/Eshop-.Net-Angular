using Eshop.Server.Models;
using Eshop.Server.Models.DTO;
using Eshop.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Eshop.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService userService;
        public UserController(UserService userService)
        {
            this.userService = userService;
        }

        [HttpPost]
        [Route("create")]
        public IActionResult CreateUser([FromBody] UserDto dto)
        {

            User user = new User();
            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }
            else if (!string.IsNullOrEmpty(dto.Oauth2Provider) && dto.Oauth2UserId.HasValue)
            {
                user.Oauth2Provider = dto.Oauth2Provider;
                user.Oauth2UserId = dto.Oauth2UserId;
            }
            else
            {
                return BadRequest("Either password or OAuth info must be provided.");
            }
            user.Email = dto.Email;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;
            user.CreatedAt = DateTime.UtcNow;
 
            return Ok(this.userService.AddUser(user));
        }

        [HttpGet]
        [Route("paged")]
        public async Task<IActionResult> GetUsersPaged(int page, int size)
        {
            var (users, total) = await userService.GetUsersPagedAsync(page, size);
            return Ok(new { users, total });
        }

        [HttpGet]
        [Route("getUserByEmail")]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            User? u = userService.GetUserByEmail(email);
            if (u == null)
                return NotFound();
            UserInfoDto udto = new UserInfoDto(u);
            Console.WriteLine(udto.Name);
            return Ok(udto);
        }
    }

}
