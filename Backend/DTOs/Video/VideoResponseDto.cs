namespace Backend.DTOs.Video
{
    public class VideoResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public int Duration { get; set; }
        public string UploadedBy { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }
}