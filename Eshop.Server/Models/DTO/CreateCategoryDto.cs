namespace Eshop.Server.Models.DTO
{
    public class CreateCategoryDto
    {        
        public string Name { get; set; } = null!;
        public List<CreateAttributeDto> Attributes { get; set; } = new();
    }
}
