namespace Eshop.Server.Models
{
    public class AttributeCat
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string TypeOfFilter { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>();
    }
}
