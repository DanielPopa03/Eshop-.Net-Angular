namespace Eshop.Server.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public DateTime PlacedAt { get; set; }

        // Snapshotted shipping address
        public string ShippingStreet { get; set; } = null!;
        public string ShippingCity { get; set; } = null!;
        public string ShippingCounty { get; set; } = null!;
        public string ShippingPostalCode { get; set; } = null!;
        

        public User Client { get; set; } = null!;

        public ICollection<OrderedProduct> OrderedProducts { get; set; } = new List<OrderedProduct>();
    }

}
