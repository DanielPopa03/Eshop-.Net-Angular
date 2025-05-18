using Eshop.Server.Data;
using Eshop.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Eshop.Server.Services
{
    public class UserService
    {
        private readonly AppDbContext context;
        public UserService(AppDbContext context)
        {
            this.context = context;
        }

        public User? GetUserByEmail(String Email)
        {
            return context.Users.SingleOrDefault(u => u.Email == Email);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public User? AddUser(User user)
        {
            try
            {
                var addedUser = context.Users.Add(user);
                context.SaveChanges();
                return addedUser.Entity;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Failed to add user: {ex.Message}");
                return null;
            }
        }

    }
}
