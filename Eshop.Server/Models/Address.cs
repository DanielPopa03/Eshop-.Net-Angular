namespace Eshop.Server.Models
{
    public class Address
    {
        public long Number { get; set; }
        public int UserId { get; set; }
        public string Street { get; set; } = null!;
        public string City { get; set; } = null!;
        public string County { get; set; } = null!;
        public string PostalCode { get; set; } = null!;
        public User User { get; set; } = null!;
    }

}
