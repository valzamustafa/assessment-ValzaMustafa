using Backend.Data;
using Backend.DTOs.Bookmark;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class BookmarkService : IBookmarkService
    {
        private readonly AppDbContext _context;

        public BookmarkService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<BookmarkResponseDto> CreateBookmark(int userId, string userName, CreateBookmarkDto request)
        {
            var video = await _context.Videos.FindAsync(request.VideoId);
            if (video == null)
            {
                throw new Exception("Video not found");
            }

            var bookmark = new Bookmark
            {
                VideoId = request.VideoId,
                UserId = userId,
                Timestamp = request.Timestamp,
                Title = request.Title,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookmarks.Add(bookmark);
            await _context.SaveChangesAsync();

            var minutes = request.Timestamp / 60;
            var seconds = request.Timestamp % 60;
            var formattedTime = $"{minutes}:{seconds:D2}";

            return new BookmarkResponseDto
            {
                Id = bookmark.Id,
                VideoId = bookmark.VideoId,
                UserName = userName,
                Timestamp = bookmark.Timestamp,
                Title = bookmark.Title,
                FormattedTime = formattedTime,
                CreatedAt = bookmark.CreatedAt
            };
        }

        public async Task<List<BookmarkResponseDto>> GetVideoBookmarks(int videoId)
        {
            var bookmarks = await _context.Bookmarks
                .Include(b => b.User)
                .Where(b => b.VideoId == videoId)
                .OrderBy(b => b.Timestamp)
                .ToListAsync();

            return bookmarks.Select(b =>
            {
                var minutes = b.Timestamp / 60;
                var seconds = b.Timestamp % 60;
                var formattedTime = $"{minutes}:{seconds:D2}";

                return new BookmarkResponseDto
                {
                    Id = b.Id,
                    VideoId = b.VideoId,
                    UserName = b.User?.FullName ?? "Unknown",
                    Timestamp = b.Timestamp,
                    Title = b.Title,
                    FormattedTime = formattedTime,
                    CreatedAt = b.CreatedAt
                };
            }).ToList();
        }

        public async Task<List<BookmarkResponseDto>> GetAllBookmarks()
        {
            var bookmarks = await _context.Bookmarks
                .Include(b => b.User)
                .Include(b => b.Video)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookmarks.Select(b =>
            {
                var minutes = b.Timestamp / 60;
                var seconds = b.Timestamp % 60;
                var formattedTime = $"{minutes}:{seconds:D2}";

                return new BookmarkResponseDto
                {
                    Id = b.Id,
                    VideoId = b.VideoId,
                    UserName = b.User?.FullName ?? "Unknown",
                    Timestamp = b.Timestamp,
                    Title = b.Title,
                    FormattedTime = formattedTime,
                    CreatedAt = b.CreatedAt
                };
            }).ToList();
        }

        public async Task<bool> DeleteBookmark(int id, int userId, bool isAdmin)
        {
            var bookmark = await _context.Bookmarks.FindAsync(id);
            if (bookmark == null)
            {
                throw new Exception("Bookmark not found");
            }

            if (!isAdmin && bookmark.UserId != userId)
            {
                throw new Exception("You don't have permission to delete this bookmark");
            }

            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}