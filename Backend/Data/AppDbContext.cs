using Microsoft.EntityFrameworkCore;
using Backend.Models;

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
                .WithMany()
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Annotation configuration
            modelBuilder.Entity<Annotation>()
                .HasOne(a => a.Video)
                .WithMany()
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
                .WithMany()
                .HasForeignKey(b => b.VideoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Bookmark>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}