namespace Eshop.Server.Models.DTO
{
    public class BasketCheckoutDto
    {
        public int clientId { get; set; }
        public BoughtItemDto[] boughtItems { get; set; }
        public string? shippingCity { get; set; } = null;
        public string? shippingStreet { get; set; } = null;
        public string? shippingCounty { get; set; } = null;
        public string? shippingPostalCode { get; set; } = null;
    }
}
