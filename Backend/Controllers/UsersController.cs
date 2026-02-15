using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.FullName,
                        u.Email,
                        u.Role,
                        u.CreatedAt,
                        VideoCount = u.Videos.Count
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = users });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.Id == id)
                    .Select(u => new
                    {
                        u.Id,
                        u.FullName,
                        u.Email,
                        u.Role,
                        u.CreatedAt,
                        VideoCount = u.Videos.Count
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                return Ok(new { success = true, data = user });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] string role)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                user.Role = role;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "User role updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                var videos = await _context.Videos.Where(v => v.UserId == id).ToListAsync();
                _context.Videos.RemoveRange(videos);

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}