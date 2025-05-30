namespace Eshop.Server.Models.DTO
{
    public class CreateAttributeDto
    {
        public int? Id { get; set; }
        public string Name { get; set; } = null!;
        public string TypeOfFilter { get; set; } = null!;
    }
}
