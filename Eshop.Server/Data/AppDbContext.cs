using Eshop.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Eshop.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderedProduct> OrderedProducts { get; set; } = null!;
        public DbSet<Address> Addresses { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<AttributeCat> AttributeCats { get; set; } = null!;
        public DbSet<ProductAttribute> ProductAttributes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>().ToTable("Role");

            modelBuilder.Entity<User>()
                        .HasMany(u => u.Supplier)
                        .WithMany(s => s.Users)
                        .UsingEntity(j => j.ToTable("SupplierUser"));

            modelBuilder.Entity<User>()
           .HasIndex(u => u.Email)  
           .IsUnique();

            modelBuilder.Entity<ProductImage>()
                .HasKey(pi => new { pi.ProductId, pi.Number });

            modelBuilder.Entity<OrderedProduct>()
                .HasKey(op => new { op.OrderId, op.ProductId });

            modelBuilder.Entity<Address>()
                .HasKey(op => new { op.Number, op.UserId });

            modelBuilder.Entity<ProductAttribute>()
                .HasKey(pa => new { pa.ProductId, pa.AttributeId });

            modelBuilder.Entity<ProductAttribute>()
                .HasOne(pa => pa.Product)
                .WithMany(p => p.Attributes)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<AttributeCat>()
                .HasOne(a => a.Category)
                .WithMany(c => c.Attributes)
                .HasForeignKey(a => a.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AttributeCat>()
                .HasMany(a => a.ProductAttributes)
                .WithOne(pa => pa.Attribute)
                .HasForeignKey(pa => pa.AttributeId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Address>()
            .HasOne(a => a.User)
            .WithMany(u => u.Addresses)
            .HasForeignKey(a => a.UserId);

            modelBuilder.Entity<ProductImage>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId);

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
