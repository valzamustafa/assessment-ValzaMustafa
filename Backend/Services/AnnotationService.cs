using Backend.Data;
using Backend.DTOs.Annotation;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AnnotationService : IAnnotationService
    {
        private readonly AppDbContext _context;

        public AnnotationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AnnotationResponseDto> CreateAnnotation(int userId, string userName, CreateAnnotationDto request)
        {
            var video = await _context.Videos.FindAsync(request.VideoId);
            if (video == null)
            {
                throw new Exception("Video not found");
            }

            var annotation = new Annotation
            {
                VideoId = request.VideoId,
                UserId = userId,
                Timestamp = request.Timestamp,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.Annotations.Add(annotation);
            await _context.SaveChangesAsync();

            var minutes = request.Timestamp / 60;
            var seconds = request.Timestamp % 60;
            var formattedTime = $"{minutes}:{seconds:D2}";

            return new AnnotationResponseDto
            {
                Id = annotation.Id,
                VideoId = annotation.VideoId,
                UserName = userName,
                Timestamp = annotation.Timestamp,
                Description = annotation.Description,
                FormattedTime = formattedTime,
                CreatedAt = annotation.CreatedAt
            };
        }

        public async Task<List<AnnotationResponseDto>> GetVideoAnnotations(int videoId)
        {
            var annotations = await _context.Annotations
                .Include(a => a.User)
                .Where(a => a.VideoId == videoId)
                .OrderBy(a => a.Timestamp)
                .ToListAsync();

            return annotations.Select(a =>
            {
                var minutes = a.Timestamp / 60;
                var seconds = a.Timestamp % 60;
                var formattedTime = $"{minutes}:{seconds:D2}";

                return new AnnotationResponseDto
                {
                    Id = a.Id,
                    VideoId = a.VideoId,
                    UserName = a.User?.FullName ?? "Unknown",
                    Timestamp = a.Timestamp,
                    Description = a.Description,
                    FormattedTime = formattedTime,
                    CreatedAt = a.CreatedAt
                };
            }).ToList();
        }

        public async Task<List<AnnotationResponseDto>> GetAllAnnotations()
        {
            var annotations = await _context.Annotations
                .Include(a => a.User)
                .Include(a => a.Video)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return annotations.Select(a =>
            {
                var minutes = a.Timestamp / 60;
                var seconds = a.Timestamp % 60;
                var formattedTime = $"{minutes}:{seconds:D2}";

                return new AnnotationResponseDto
                {
                    Id = a.Id,
                    VideoId = a.VideoId,
                    UserName = a.User?.FullName ?? "Unknown",
                    Timestamp = a.Timestamp,
                    Description = a.Description,
                    FormattedTime = formattedTime,
                    CreatedAt = a.CreatedAt
                };
            }).ToList();
        }

        public async Task<bool> DeleteAnnotation(int id, int userId, bool isAdmin)
        {
            var annotation = await _context.Annotations.FindAsync(id);
            if (annotation == null)
            {
                throw new Exception("Annotation not found");
            }

            if (!isAdmin && annotation.UserId != userId)
            {
                throw new Exception("You don't have permission to delete this annotation");
            }

            _context.Annotations.Remove(annotation);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}