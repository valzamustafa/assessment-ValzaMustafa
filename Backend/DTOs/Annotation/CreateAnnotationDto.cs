using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Annotation
{
    public class CreateAnnotationDto
    {
        [Required]
        public int VideoId { get; set; }
        
        [Required]
        public int Timestamp { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}