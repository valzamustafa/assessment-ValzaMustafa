using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Video
{
    public class CreateVideoDto
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Video file is required")]
        public IFormFile VideoFile { get; set; } = null!;
    }
}