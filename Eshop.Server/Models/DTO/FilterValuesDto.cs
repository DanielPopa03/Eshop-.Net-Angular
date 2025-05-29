namespace Eshop.Server.Models.DTO
{
    public class FilterValuesDto
    {
        public int AttributeId { get; set; }

        public List<string> Values { get; set; } = new();
    }
}
