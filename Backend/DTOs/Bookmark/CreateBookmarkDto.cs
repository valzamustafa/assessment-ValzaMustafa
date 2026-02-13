using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Bookmark
{
    public class CreateBookmarkDto
    {
        [Required]
        public int VideoId { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Timestamp must be positive")]
        public int Timestamp { get; set; }

        [Required]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;
    }
}