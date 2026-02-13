using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Bookmark
    {
        [Key]
        public int Id { get; set; }
        public int VideoId { get; set; }
        public int UserId { get; set; }
        public int Timestamp { get; set; } 
        public required string Title { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Video Video { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}