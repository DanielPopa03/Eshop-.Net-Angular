using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

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

        public Product toProduct(List<AttributeValueDto> attributes)
        {
            return new Product
            {
                Id = this.Id,
                SupplierId = this.SupplierId,
                CategoryId = this.CategoryId,
                Stock = this.Stock,
                Description = this.Description,
                Name = this.Name,
                Price = this.Price,
                Attributes = attributes.Select(a => new ProductAttribute
                {
                    AttributeId = a.AttributeId,
                    Value = a.Value
                }).ToList()
            };
        }
    }
}
