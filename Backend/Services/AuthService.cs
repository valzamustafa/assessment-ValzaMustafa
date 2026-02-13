using Backend.Data;
using Backend.DTOs.Auth;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<LoginResponseDto> Register(RegisterDto request)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (userExists)
            {
                throw new Exception("User with this email already exists");
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
               PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateToken(user);

            return new LoginResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = token
            };
        }

        public async Task<LoginResponseDto> Login(LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                throw new Exception("Invalid email or password");
            }

            var isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isValid)
            {
                throw new Exception("Invalid email or password");
            }

            var token = GenerateToken(user);

            return new LoginResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = token
            };
        }

        private string GenerateToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var jwtKey = _config["Jwt:Key"] ?? "your-super-secret-key-with-at-least-32-characters-here";
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"] ?? "http://localhost:5000",
        audience: _config["Jwt:Audience"] ?? "http://localhost:5000",
        claims: claims,
        expires: DateTime.Now.AddDays(7),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
    }
}