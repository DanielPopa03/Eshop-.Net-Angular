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

        public User? AddUser(User user)
        {
            var addedUser = context.Users.Add(user);

            context.SaveChanges();

            return addedUser.Entity;
        }
    }
}
