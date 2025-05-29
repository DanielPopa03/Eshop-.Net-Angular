namespace Eshop.Server.Models.DTO
{
    public class FilterParamDto
    {
        public required int  PageIndex { get; set; }
        public required int PageSize { get; set; }
        public int? CategoryId { get; set; }
        public required string OrderBy { get; set; }
        public string? PriceFilter { get; set; }
        public string? StockFilter { get; set; }
        public required List<FilterValuesDto> Filters { get; set; }

    }
}
