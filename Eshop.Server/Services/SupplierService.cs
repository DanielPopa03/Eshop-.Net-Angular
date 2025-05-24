using Eshop.Server.Data;
using Eshop.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Eshop.Server.Services
{
    public class SupplierService
    {
        private readonly AppDbContext context;

        public SupplierService(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Supplier>> GetAllSuppliersAsync()
        {
            return await context.Suppliers.ToListAsync();
        }

        public async Task<List<Supplier>> GetUserSuppliersByEmailAsync(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                throw new Exception("User not found");

            return await context.Suppliers
                .Where(s => s.Users.Any(u => u.Id == user.Id))
                .ToListAsync();
        }

    }
}
