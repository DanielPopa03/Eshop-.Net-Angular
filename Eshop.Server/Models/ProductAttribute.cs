namespace Eshop.Server.Models
{
    public class ProductAttribute
    {
        public int ProductId { get; set; }
        public int AttributeId { get; set; }
        public Product Product { get; set; }
        public AttributeCat Attribute { get; set; }
        public string Value { get; set; }
    }
}
