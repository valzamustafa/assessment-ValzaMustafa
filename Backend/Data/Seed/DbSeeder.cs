using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Data.Seed
{
    public static class DbSeeder
    {
        public static void Seed(ModelBuilder modelBuilder)
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
                    CreatedAt = DateTime.UtcNow
                }
            );
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}