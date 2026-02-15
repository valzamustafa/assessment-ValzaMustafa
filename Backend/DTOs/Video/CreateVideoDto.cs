using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Video
{
    public class CreateVideoDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }
        
        [Required(ErrorMessage = "Video file is required")]
        public IFormFile VideoFile { get; set; } = null!;
    }
}