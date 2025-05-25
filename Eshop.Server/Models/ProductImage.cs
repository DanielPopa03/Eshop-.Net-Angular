namespace Eshop.Server.Models
{
    public class ProductImage
    {
        public int Number { get; set; }
        public int ProductId { get; set; }

        public required string ImageUrl { get; set; }

        public Product Product { get; set; } = null!;
    }
}
