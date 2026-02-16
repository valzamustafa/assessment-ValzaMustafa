using Backend.DTOs.Video;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Features;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/videos")]
    [ApiController]
    [Authorize]
    public class VideoController : ControllerBase
    {
        private readonly IVideoService _videoService;

        public VideoController(IVideoService videoService)
        {
            _videoService = videoService;
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

        [HttpPost("upload")]
        [RequestSizeLimit(104857600)]
        [RequestFormLimits(MultipartBodyLengthLimit = 104857600)]
        public async Task<IActionResult> Upload([FromForm] CreateVideoDto request)
        {
            try
            {
                Console.WriteLine("=== UPLOAD REQUEST ===");
                Console.WriteLine($"Title: {request.Title}");
                Console.WriteLine($"Description: {request.Description}");
                Console.WriteLine($"Has Video File: {request.VideoFile != null}");
                
                if (request.VideoFile == null || request.VideoFile.Length == 0)
                {
                    return BadRequest(new { success = false, message = "Video file is required" });
                }

                Console.WriteLine($"File Name: {request.VideoFile.FileName}");
                Console.WriteLine($"File Size: {request.VideoFile.Length} bytes");
                Console.WriteLine($"Content Type: {request.VideoFile.ContentType}");

                var userId = GetUserId();
                Console.WriteLine($"User ID: {userId}");
                
                var result = await _videoService.UploadVideo(userId, request);
                Console.WriteLine($"Video saved with ID: {result.Id}");
                
                return Ok(new { success = true, message = "Video uploaded successfully", data = result });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Upload error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVideos()
        {
            try
            {
                var videos = await _videoService.GetAllVideos();
                return Ok(new { success = true, data = videos });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("my-videos")]
        public async Task<IActionResult> GetMyVideos()
        {
            try
            {
                var userId = GetUserId();
                var videos = await _videoService.GetUserVideos(userId);
                return Ok(new { success = true, data = videos });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVideo(int id)
        {
            try
            {
                var video = await _videoService.GetVideoById(id);
                if (video == null)
                    return NotFound(new { success = false, message = "Video not found" });
                    
                return Ok(new { success = true, data = video });
            }
            catch (Exception ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(int id)
        {
            try
            {
                var userId = GetUserId();
                var isAdmin = IsAdmin();
                await _videoService.DeleteVideo(id, userId, isAdmin);
                return Ok(new { success = true, message = "Video deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}