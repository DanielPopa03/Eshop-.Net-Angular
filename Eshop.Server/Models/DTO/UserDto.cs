namespace Eshop.Server.Models.DTO
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }

        // For password-based registration
        public string? Password { get; set; }

        // For OAuth2 registration
        public string? Oauth2Provider { get; set; }
        public long? Oauth2UserId { get; set; }
    }
}
