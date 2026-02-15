using System;

namespace Backend.DTOs.Bookmark
{
    public class BookmarkResponseDto
    {
        public int Id { get; set; }
        public int VideoId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Timestamp { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FormattedTime { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}