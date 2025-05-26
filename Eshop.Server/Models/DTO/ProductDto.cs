namespace Eshop.Server.Models.DTO
{
    public class ProductDto
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public int CategoryId { get; set; }
        public uint Stock { get; set; }
        public required string Description { get; set; }
        public string Name { get; set; } = null!;
        public int Price { get; set; }

        public Product toProduct()
        {
            Product newProduct = new Product
            {
                Id = this.Id,
                SupplierId = this.SupplierId,
                CategoryId = this.CategoryId,
                Stock = this.Stock,
                Description = this.Description,
                Name = this.Name,
                Price = this.Price
            };
            return newProduct;
        }
    }
}
