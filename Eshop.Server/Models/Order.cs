using Eshop.Server.Models.DTO;

namespace Eshop.Server.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public DateTime PlacedAt { get; set; } = DateTime.Now;

        // Snapshotted shipping address
        public string ShippingStreet { get; set; } = null!;
        public string ShippingCity { get; set; } = null!;
        public string ShippingCounty { get; set; } = null!;
        public string ShippingPostalCode { get; set; } = null!;
        

        public User Client { get; set; } = null!;

        public ICollection<OrderedProduct> OrderedProducts { get; set; } = new List<OrderedProduct>();

        public Order() { }

        public Order(BasketCheckoutDto Basket)
        {
            this.ClientId = Basket.clientId;
            this.ShippingStreet = Basket.shippingStreet ?? string.Empty;
            this.ShippingCity = Basket.shippingCity ?? string.Empty;
            this.ShippingCounty = Basket.shippingCounty ?? string.Empty;
            this.ShippingPostalCode = Basket.shippingPostalCode ?? string.Empty;
        }
    }

}
