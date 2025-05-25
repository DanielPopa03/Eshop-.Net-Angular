using Eshop.Server.Data;
using Eshop.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

        public async Task<List<User>> GetModeratorsOfSupplier(int supplierId)
        {
            var moderators = await context.Users
                .Include(u => u.Role)
                .Include(u => u.Supplier)
                .Where(u => (u.Role.Name == "Moderator" || u.Role.Name == "Admin") &&
                            u.Supplier.Any(sup => sup.Id == supplierId))
                .ToListAsync();

            return moderators;
        }

        public async Task<bool> AddModerator(int supplierId, int moderatorUserId)
        {
            var s = await context.Suppliers.FindAsync(supplierId);
            var mod = await context.Users
                .Include(u => u.Role) // Make sure Role is loaded
                .Include(u => u.Supplier) // If needed
                .FirstOrDefaultAsync(u => u.Id == moderatorUserId);

            if (mod != null && s != null)
            {
                if (!mod.Supplier.Contains(s))
                {
                    mod.Supplier.Add(s);
                    Console.WriteLine("Added supplier!" + s.Name);
                }

                if (mod.Role == null || (mod.Role.Name != "Moderator" && mod.Role.Name != "Admin"))
                {
                    var moderatorRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Moderator");
                    if (moderatorRole != null)
                    {
                        mod.Role = moderatorRole;
                    }
                    else
                    {
                        // Optionally throw or log here: missing expected role
                        return false;
                    }
                }

                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> RemoveModerator(int supplierId, int moderatorUserId)
        {
            var s = await context.Suppliers.FindAsync(supplierId);
            var mod = await context.Users
                .Include(u => u.Role) // Make sure Role is loaded
                .Include(u => u.Supplier) // If needed
                .FirstOrDefaultAsync(u => u.Id == moderatorUserId);

            if (s == null || mod == null)
                return false;

            if (mod.Supplier.Contains(s))
                mod.Supplier.Remove(s);
            else
                return false;

            if (mod.Role.Name == "Moderator" && mod.Supplier.Count == 0)
                mod.Role = null;

            await context.SaveChangesAsync();

            return true;
        }

    }
}
