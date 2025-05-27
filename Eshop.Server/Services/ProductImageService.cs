using Eshop.Server.Data;
using Eshop.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Eshop.Server.Services
{
    public class ProductImageService
    {
        private readonly AppDbContext context;
        private readonly IWebHostEnvironment env;

        public ProductImageService(AppDbContext context, IWebHostEnvironment env)
        {
            this.context = context;
            this.env = env;
        }

        public async Task SaveImagesAsync(int productId, List<IFormFile> files)
        {
            var uploadFolder = Path.Combine(env.WebRootPath, "uploads", "products");
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var imageWithMaxNumber = await context.ProductImages
            .Where(pi => pi.ProductId == productId)
            .OrderByDescending(pi => pi.Number)
            .FirstOrDefaultAsync();

            var max_number = imageWithMaxNumber == null ? 0 : imageWithMaxNumber.Number;

            for (int i = 0; i < files.Count; i++)
            {
                var file = files[i];
                if (file.Length > 0)
                {
                    var extension = Path.GetExtension(file.FileName); // e.g. .jpg
                    var fileName = $"{productId}_{i+ max_number + 1}{extension}";
                    var filePath = Path.Combine(uploadFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var image = new ProductImage
                    {
                        Number = i + max_number + 1,
                        ProductId = productId,
                        ImageUrl = $"/uploads/products/{fileName}"
                    };

                    context.ProductImages.Add(image);
                }
            }
            await context.SaveChangesAsync();
        }

    }

}
