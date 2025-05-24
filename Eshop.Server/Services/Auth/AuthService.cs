using Eshop.Server.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Eshop.Server.Data;

namespace Eshop.Server.Services.Auth
{
    public class AuthService
    {
        private readonly JwtSettings jwtSettings;
        private readonly AppDbContext context;
        private readonly UserService userService;

        public AuthService(IOptions<JwtSettings> jwtSettings, UserService userService, AppDbContext context)
        {
            this.jwtSettings = jwtSettings.Value;
            this.context = context;
            this.userService = userService;
        }

        public string GenerateJwtToken(User user)
        {
            // Create claims
            var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role?.Name ?? ""),
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

        public void SendPasswordResetEmail(string toEmail, string resetLink)
        {
            var from = new MailAddress("sofronea.georgian11A@lmkvaslui.ro", "Eshop");
            var to = new MailAddress(toEmail);

            var smtp = new SmtpClient
            {
                Host = "in-v3.mailjet.com",
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential("5e0dd231e6da3af94f3153a5c7d41cd8", "f1802c58ea9e91c579c8e0de81f83b98")
            };

            var message = new MailMessage(from, to)
            {
                Subject = "Reset your password",
                Body = $"Click this link to reset your password:\n{resetLink}"
            };

            smtp.Send(message);
        }


        public async Task<string> CreateResetTokenAsync(string email)
        {
            var token = Guid.NewGuid().ToString();
            var expiration = DateTime.UtcNow.AddHours(1);

            context.PasswordResetTokens.Add(new PasswordResetToken
            {
                Email = email,
                Token = token,
                Expiration = expiration
            });

            await context.SaveChangesAsync();

            return token;
        }

        public async Task<PasswordResetToken?> GetResetTokenAsync(string token)
        {
            return await context.PasswordResetTokens.FirstOrDefaultAsync(t => t.Token == token);
        }

        public async Task<User?> GetUserByResetTokenAsync(string token)
        {
            var tokenEntry = await GetResetTokenAsync(token);
            if (tokenEntry == null || tokenEntry.Expiration < DateTime.UtcNow)
                return null;

            return await this.userService.GetUserByEmailAsync(tokenEntry.Email);
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPasswordHash)
        {
            var tokenEntry = await GetResetTokenAsync(token);
            if (tokenEntry == null || tokenEntry.Expiration < DateTime.UtcNow)
                return false;

            var user = await this.userService.GetUserByEmailAsync(tokenEntry.Email);
            if (user == null)
                return false;

            user.PasswordHash = newPasswordHash;

            context.PasswordResetTokens.Remove(tokenEntry);
            await context.SaveChangesAsync();

            return true;
        }
    }
}
