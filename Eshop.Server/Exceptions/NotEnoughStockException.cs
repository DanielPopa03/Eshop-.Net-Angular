namespace Eshop.Server.Exceptions
{
    public class NotEnoughStockException : Exception
    {
        public string ProductName { get; set; }
        public NotEnoughStockException(string ProductName) { 
            this.ProductName = ProductName;
        }
    }
}
