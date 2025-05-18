using Eshop.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Eshop.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderedProduct> OrderedProducts { get; set; } = null!;
        public DbSet<Address> Addresses { get; set; } = null!;
        //
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
           .HasIndex(u => u.Email)  
           .IsUnique();

            modelBuilder.Entity<OrderedProduct>()
                .HasKey(op => new { op.OrderId, op.ProductId });

            modelBuilder.Entity<Address>()
                .HasKey(op => new { op.Number, op.UserId });

            modelBuilder.Entity<Address>()
            .HasOne(a => a.User)
            .WithMany(u => u.Addresses)
            .HasForeignKey(a => a.UserId);

            modelBuilder.Entity<OrderedProduct>()
                .HasOne(op => op.Order)
                .WithMany(o => o.OrderedProducts)
                .HasForeignKey(op => op.OrderId);

            modelBuilder.Entity<OrderedProduct>()
                .HasOne(op => op.Product)
                .WithMany(p => p.OrderedProducts)
                .HasForeignKey(op => op.ProductId);
        }

    }
}
