using Backend.Data;
using Backend.DTOs.Video;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class VideoService : IVideoService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpAccessor;

        public VideoService(AppDbContext context, IWebHostEnvironment env, IHttpContextAccessor httpAccessor)
        {
            _context = context;
            _env = env;
            _httpAccessor = httpAccessor;
        }

        public async Task<VideoResponseDto> UploadVideo(int userId, CreateVideoDto request)
        {
            if (request.VideoFile == null || request.VideoFile.Length == 0)
            {
                throw new Exception("No file uploaded");
            }

            var allowedExtensions = new[] { ".mp4", ".webm", ".mov" };
            var extension = Path.GetExtension(request.VideoFile.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
            {
                throw new Exception("Invalid file type. Only MP4, WebM and MOV are allowed.");
            }

            if (request.VideoFile.Length > 100 * 1024 * 1024)
            {
                throw new Exception("File too large. Maximum size is 100MB.");
            }

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads", "Videos");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.VideoFile.CopyToAsync(stream);
            }

            var video = new Video
            {
                Title = request.Title,
                FilePath = $"/Uploads/Videos/{fileName}",
                Duration = 0,
                UserId = userId,
                UploadedAt = DateTime.UtcNow
            };

            _context.Videos.Add(video);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            var baseUrl = _httpAccessor.HttpContext != null 
            ? $"{_httpAccessor.HttpContext.Request.Scheme}://{_httpAccessor.HttpContext.Request.Host}" 
            : "";

            return new VideoResponseDto
            {
                Id = video.Id,
                Title = video.Title,
                VideoUrl = baseUrl + video.FilePath,
                Duration = video.Duration,
                UploadedBy = user?.FullName ?? "Unknown",
                UploadedAt = video.UploadedAt
            };
        }

        public async Task<List<VideoResponseDto>> GetAllVideos()
        {
            var videos = await _context.Videos
                .Include(v => v.User)
                .OrderByDescending(v => v.UploadedAt)
                .ToListAsync();

            var baseUrl = _httpAccessor.HttpContext != null 
            ? $"{_httpAccessor.HttpContext.Request.Scheme}://{_httpAccessor.HttpContext.Request.Host}" 
            : "";


            return videos.Select(v => new VideoResponseDto
            {
                Id = v.Id,
                Title = v.Title,
                VideoUrl = baseUrl + v.FilePath,
                Duration = v.Duration,
                UploadedBy = v.User?.FullName ?? "Unknown",
                UploadedAt = v.UploadedAt
            }).ToList();
        }

        public async Task<List<VideoResponseDto>> GetUserVideos(int userId)
        {
            var videos = await _context.Videos
                .Include(v => v.User)
                .Where(v => v.UserId == userId)
                .OrderByDescending(v => v.UploadedAt)
                .ToListAsync();

            var baseUrl = _httpAccessor.HttpContext != null 
            ? $"{_httpAccessor.HttpContext.Request.Scheme}://{_httpAccessor.HttpContext.Request.Host}" 
            : "";


            return videos.Select(v => new VideoResponseDto
            {
                Id = v.Id,
                Title = v.Title,
                VideoUrl = baseUrl + v.FilePath,
                Duration = v.Duration,
                UploadedBy = v.User?.FullName ?? "Unknown",
                UploadedAt = v.UploadedAt
            }).ToList();
        }

        public async Task<VideoResponseDto> GetVideoById(int id)
        {
            var video = await _context.Videos
                .Include(v => v.User)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (video == null)
            {
                throw new Exception("Video not found");
            }

            var baseUrl = _httpAccessor.HttpContext != null 
            ? $"{_httpAccessor.HttpContext.Request.Scheme}://{_httpAccessor.HttpContext.Request.Host}" 
            : "";


            return new VideoResponseDto
            {
                Id = video.Id,
                Title = video.Title,
                VideoUrl = baseUrl + video.FilePath,
                Duration = video.Duration,
                UploadedBy = video.User?.FullName ?? "Unknown",
                UploadedAt = video.UploadedAt
            };
        }

        public async Task<bool> DeleteVideo(int id, int userId, bool isAdmin)
        {
            var video = await _context.Videos.FindAsync(id);
            if (video == null)
            {
                throw new Exception("Video not found");
            }

            if (!isAdmin && video.UserId != userId)
            {
                throw new Exception("You don't have permission to delete this video");
            }

            var filePath = Path.Combine(_env.ContentRootPath, video.FilePath.TrimStart('/'));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            _context.Videos.Remove(video);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}