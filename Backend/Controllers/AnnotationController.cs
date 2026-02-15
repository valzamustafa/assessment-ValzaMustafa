using Backend.DTOs.Annotation;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/videos/{videoId}/annotations")]
    [ApiController]
    [Authorize]
    public class AnnotationController : ControllerBase
    {
        private readonly IAnnotationService _annotationService;

        public AnnotationController(IAnnotationService annotationService)
        {
            _annotationService = annotationService;
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
        public async Task<IActionResult> CreateAnnotation(int videoId, [FromBody] CreateAnnotationDto request)
        {
            try
            {
                var userId = GetUserId();
                var result = await _annotationService.CreateAnnotation(videoId, userId, request);
                return Ok(new { success = true, message = "Annotation created successfully", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetVideoAnnotations(int videoId)
        {
            try
            {
                var annotations = await _annotationService.GetVideoAnnotations(videoId);
                return Ok(new { success = true, data = annotations });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAnnotations()
        {
            try
            {
                var annotations = await _annotationService.GetAllAnnotations();
                return Ok(new { success = true, data = annotations });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnotation(int videoId, int id)
        {
            try
            {
                var userId = GetUserId();
                var isAdmin = IsAdmin();
                await _annotationService.DeleteAnnotation(id, userId, isAdmin);
                return Ok(new { success = true, message = "Annotation deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}