using Eshop.Server.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Eshop.Server.Services.Auth
{
    public class AuthService
    {
        private readonly JwtSettings jwtSettings;

        public AuthService(IOptions<JwtSettings> jwtSettings)
        {
            this.jwtSettings = jwtSettings.Value;
        }

        public string GenerateJwtToken(User user)
        {
            // Create claims
            var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim("role", user.Role?.Name ?? string.Empty),
                    new Claim("first_name", user.FirstName),
                    new Claim("last_name", user.LastName),
                };

            if (user.CreatedAt.HasValue)
            {
                claims.Add(new Claim("created_at", user.CreatedAt.Value.ToString()));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create the token
            var token = new JwtSecurityToken(
                issuer: this.jwtSettings.Issuer,  
                audience: this.jwtSettings.Audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            // Return the token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
