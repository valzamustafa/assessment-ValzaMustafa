using System;

namespace Backend.DTOs.Video
{
    public class VideoResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public int Duration { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
        public int AnnotationCount { get; set; }
        public int BookmarkCount { get; set; }
    }
}