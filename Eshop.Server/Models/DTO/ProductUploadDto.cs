using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Eshop.Server.Models.DTO
{
    public class ProductUploadDto
    {
        public int SupplierId { get; set; }
        public int CategoryId { get; set; }
        public uint Stock { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Price { get; set; }
    }
}
