namespace Eshop.Server.Models
{
    public class Product
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public int CategoryId { get; set; }
        public uint Stock { get; set; }
        public required string Description { get; set; }
        public string Name { get; set; } = null!;
        public int Price { get; set; }
        public Supplier Supplier { get; set; } = null!;
        public Category Category { get; set; } = null!;

        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<OrderedProduct> OrderedProducts { get; set; } = new List<OrderedProduct>();
    }

}
