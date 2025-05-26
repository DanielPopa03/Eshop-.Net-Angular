namespace Eshop.Server.Models.DTO
{
    public class NewReviewDto
    {
        public int ProductId { get; set; }
        public int Rating { get; set; }
        public string Text { get; set; }
    }
}
