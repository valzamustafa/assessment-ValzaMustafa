using Microsoft.EntityFrameworkCore;
using Backend.Models;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) 
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<Annotation> Annotations { get; set; }
        public DbSet<Bookmark> Bookmarks { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Video configuration 
            modelBuilder.Entity<Video>()
                .HasOne(v => v.User)
                .WithMany(u => u.Videos)
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Annotation configuration 
            modelBuilder.Entity<Annotation>()
                .HasOne(a => a.Video)
                .WithMany(v => v.Annotations)
                .HasForeignKey(a => a.VideoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Annotation>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Bookmark configuration 
            modelBuilder.Entity<Bookmark>()
                .HasOne(b => b.Video)
                .WithMany(v => v.Bookmarks)
                .HasForeignKey(b => b.VideoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Bookmark>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // RefreshToken configuration
            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        
            SeedAdmin(modelBuilder);
        }

        private void SeedAdmin(ModelBuilder modelBuilder)
        {
            var password = "admin123";
            var passwordHash = HashPassword(password);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FullName = "Admin User",
                    Email = "admin@gmail.com",
                    PasswordHash = passwordHash,
                    Role = "Admin",
                    CreatedAt = new DateTime(2026, 2, 15, 22, 0, 0, DateTimeKind.Utc) 
                }
            );
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}