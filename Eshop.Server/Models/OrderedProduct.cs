namespace Eshop.Server.Models
{
    public class OrderedProduct
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public uint Quantity { get; set; }

        public Order Order { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }

}
