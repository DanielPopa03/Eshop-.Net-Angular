namespace Eshop.Server.Exceptions
{
    public class ProductNotFoundException : Exception
    {
        public int ProductId { get; set; } 
        public ProductNotFoundException(int productId) { 
            this.ProductId = productId;
        }
    }
}
