using Microsoft.EntityFrameworkCore;

namespace Eshop.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string? PasswordHash { get; set; }
        public string? Oauth2Provider { get; set; }
        public long? Oauth2UserId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? RoleId { get; set; }

        public Role? Role { get; set; }
        public ICollection<Address> Addresses { get; set; } = new List<Address>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Supplier> Supplier { get; set; } = new List<Supplier>();
    }

}
