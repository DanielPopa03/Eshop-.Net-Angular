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
        public User? GetUserByEmail(string email)
        {
            return context.Users
                .Include(u => u.Role)
                .SingleOrDefault(u => u.Email == email);
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

        public async Task<(List<User> Users, int TotalCount)> GetUsersPagedAsync(int pageNumber, int pageSize)
        {
            var users = await context.Users
                .Include(u => u.Role)
                .OrderBy(u => u.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalCount = await context.Users.CountAsync();

            return (users, totalCount);
        }


    }
}
