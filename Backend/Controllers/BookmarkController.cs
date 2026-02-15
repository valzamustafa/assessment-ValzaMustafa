using Backend.DTOs.Bookmark;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/videos/{videoId}/bookmarks")]
    [ApiController]
    [Authorize]
    public class BookmarkController : ControllerBase
    {
        private readonly IBookmarkService _bookmarkService;

        public BookmarkController(IBookmarkService bookmarkService)
        {
            _bookmarkService = bookmarkService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        private bool IsAdmin()
        {
            return User.IsInRole("Admin");
        }

       [HttpPost]
    public async Task<IActionResult> CreateBookmark(int videoId, [FromBody] CreateBookmarkDto request)
    {
    try
    {
        Console.WriteLine("=== CREATE BOOKMARK REQUEST ===");
        Console.WriteLine($"URL videoId: {videoId}");
        Console.WriteLine($"Request.VideoId: {request.VideoId}");
        Console.WriteLine($"Request.Timestamp: {request.Timestamp}");
        Console.WriteLine($"Request.Title: {request.Title}");
        
        if (request.Timestamp < 0)
        {
            return BadRequest(new { success = false, message = "Timestamp cannot be negative" });
        }
        
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new { success = false, message = "Title is required" });
        }
        
        if (request.VideoId != videoId)
        {
            return BadRequest(new { success = false, message = "Video ID mismatch" });
        }

        var userId = GetUserId();
        var result = await _bookmarkService.CreateBookmark(videoId, userId, request);
        return Ok(new { success = true, message = "Bookmark created successfully", data = result });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
        return BadRequest(new { success = false, message = ex.Message });
    }
}
        [HttpGet]
        public async Task<IActionResult> GetVideoBookmarks(int videoId)
        {
            try
            {
                var bookmarks = await _bookmarkService.GetVideoBookmarks(videoId);
                return Ok(new { success = true, data = bookmarks });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBookmarks()
        {
            try
            {
                var bookmarks = await _bookmarkService.GetAllBookmarks();
                return Ok(new { success = true, data = bookmarks });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookmark(int videoId, int id)
        {
            try
            {
                var userId = GetUserId();
                var isAdmin = IsAdmin();
                await _bookmarkService.DeleteBookmark(id, userId, isAdmin);
                return Ok(new { success = true, message = "Bookmark deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}