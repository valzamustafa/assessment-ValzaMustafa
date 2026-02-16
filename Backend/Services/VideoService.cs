using Backend.Data;
using Backend.DTOs.Video;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class VideoService : IVideoService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public VideoService(
            AppDbContext context, 
            IWebHostEnvironment environment,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<VideoResponseDto> UploadVideo(int userId, CreateVideoDto createVideoDto)
        {
            try
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Videos");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                
                var fileExtension = Path.GetExtension(createVideoDto.VideoFile.FileName);
                var uniqueFileName = $"{Guid.NewGuid()}_{DateTime.Now.Ticks}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                Console.WriteLine($"Saving file to: {filePath}");
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await createVideoDto.VideoFile.CopyToAsync(stream);
                }
                var httpRequest = _httpContextAccessor.HttpContext.Request;
                var baseUrl = $"{httpRequest.Scheme}://{httpRequest.Host}";
                var videoUrl = $"{baseUrl}/Uploads/Videos/{uniqueFileName}";

                Console.WriteLine($"Video URL: {videoUrl}");
                var video = new Video
                {
                    Title = createVideoDto.Title,
                    Description = createVideoDto.Description,
                    VideoPath = filePath,
                    VideoUrl = videoUrl,
                    FileName = uniqueFileName,
                    FileSize = createVideoDto.VideoFile.Length,
                    ContentType = createVideoDto.VideoFile.ContentType,
                    UserId = userId,
                    UploadedAt = DateTime.UtcNow,
                    Duration = 0 
                };

                _context.Videos.Add(video);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Video saved to database with ID: {video.Id}");

                return MapToDto(video);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UploadVideo: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<VideoResponseDto>> GetAllVideos()
        {
            var videos = await _context.Videos
                .Include(v => v.User)
                .Include(v => v.Annotations)
                .Include(v => v.Bookmarks)
                .OrderByDescending(v => v.UploadedAt)
                .ToListAsync();

            return videos.Select(MapToDto);
        }

        public async Task<IEnumerable<VideoResponseDto>> GetUserVideos(int userId)
        {
            var videos = await _context.Videos
                .Where(v => v.UserId == userId)
                .Include(v => v.User)
                .Include(v => v.Annotations)
                .Include(v => v.Bookmarks)
                .OrderByDescending(v => v.UploadedAt)
                .ToListAsync();

            return videos.Select(MapToDto);
        }

        public async Task<VideoResponseDto?> GetVideoById(int id)
        {
            var video = await _context.Videos
                .Include(v => v.User)
                .Include(v => v.Annotations)
                .Include(v => v.Bookmarks)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (video == null)
                return null;

            return MapToDto(video);
        }

        public async Task<bool> DeleteVideo(int id, int userId, bool isAdmin)
        {
            var video = await _context.Videos.FindAsync(id);
            if (video == null)
                return false;

            if (video.UserId != userId && !isAdmin)
                throw new UnauthorizedAccessException("You don't have permission to delete this video");

            if (File.Exists(video.VideoPath))
            {
                File.Delete(video.VideoPath);
                Console.WriteLine($"Deleted file: {video.VideoPath}");
            }
            _context.Videos.Remove(video);
            await _context.SaveChangesAsync();

            return true;
        }

        private VideoResponseDto MapToDto(Video video)
        {
            return new VideoResponseDto
            {
                Id = video.Id,
                Title = video.Title,
                Description = video.Description,
                VideoUrl = video.VideoUrl,
                ThumbnailUrl = null, 
                Duration = video.Duration,
                UserId = video.UserId,
                UserName = video.User?.FullName ?? "Unknown",
                UploadedAt = video.UploadedAt,
                AnnotationCount = video.Annotations?.Count ?? 0,
                BookmarkCount = video.Bookmarks?.Count ?? 0
            };
        }
    }
}