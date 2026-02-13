using Backend.DTOs.Bookmark;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
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

        private string GetUserName()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";
        }

        private bool IsAdmin()
        {
            return User.IsInRole("Admin");
        }

        [HttpPost]
        public async Task<IActionResult> CreateBookmark([FromBody] CreateBookmarkDto request)
        {
            try
            {
                var userId = GetUserId();
                var userName = GetUserName();
                var result = await _bookmarkService.CreateBookmark(userId, userName, request);
                return Ok(new { success = true, message = "Bookmark created successfully", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("video/{videoId}")]
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
        public async Task<IActionResult> DeleteBookmark(int id)
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