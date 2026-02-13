using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Video
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string FilePath { get; set; }
        public  string? ThumbnailPath { get; set; }
        public int Duration { get; set; }
        public  required int UserId { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public User User { get; set; }= null!;
    }
}