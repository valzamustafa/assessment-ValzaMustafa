using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Bookmark
{
    public class CreateBookmarkDto
    {
        [Required]
        public int VideoId { get; set; }
        
        [Required]
        public int Timestamp { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
    }
}