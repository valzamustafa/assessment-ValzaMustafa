using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Annotation
{
    public class CreateAnnotationDto
    {
        [Required]
        public int VideoId { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Timestamp must be positive")]
        public int Timestamp { get; set; }

        [Required]
        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; } = string.Empty;
    }
}