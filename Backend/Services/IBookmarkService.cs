using Backend.DTOs.Bookmark;

namespace Backend.Services
{
    public interface IBookmarkService
    {
        Task<BookmarkResponseDto> CreateBookmark(int videoId, int userId, CreateBookmarkDto request);
        Task<List<BookmarkResponseDto>> GetVideoBookmarks(int videoId);
        Task<List<BookmarkResponseDto>> GetAllBookmarks();
        Task<bool> DeleteBookmark(int id, int userId, bool isAdmin);
    }
}