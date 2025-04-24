namespace Eshop.Server.Models
{
    public class Supplier
    {
        public int Id { get; set; }
        public string ContactEmail { get; set; } = null!;
        public string Name { get; set; } = null!;

        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<User> Users { get; set; } = new List<User>();
    }

}
