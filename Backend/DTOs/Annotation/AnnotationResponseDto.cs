using System;

namespace Backend.DTOs.Annotation
{
    public class AnnotationResponseDto
    {
        public int Id { get; set; }
        public int VideoId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Timestamp { get; set; }
        public string Description { get; set; } = string.Empty;
        public string FormattedTime { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}