using System.Security.Cryptography;
using System.Text;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;

        public AuthService(
            AppDbContext context, 
            ITokenService tokenService,
            IConfiguration configuration)
        {
            _context = context;
            _tokenService = tokenService;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> Register(RegisterDto registerDto)
        {
          
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

            if (existingUser != null)
                return null;
            var user = new User
            {
                FullName  = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = HashPassword(registerDto.Password),
                Role = "user",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = await _tokenService.GenerateAndStoreRefreshToken(user.Id);

            return new AuthResponseDto
            {
                Id = user.Id,
                Name = user.FullName ,
                Email = user.Email,
                Role = user.Role,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                ExpiresIn = Convert.ToInt32(_configuration["Jwt:AccessTokenExpiryMinutes"]) * 60
            };
        }

        public async Task<AuthResponseDto?> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
                return null;

            await _tokenService.RevokeAllUserTokens(user.Id);

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = await _tokenService.GenerateAndStoreRefreshToken(user.Id);

            return new AuthResponseDto
            {
                Id = user.Id,
                Name = user.FullName ,
                Email = user.Email,
                Role = user.Role,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                ExpiresIn = Convert.ToInt32(_configuration["Jwt:AccessTokenExpiryMinutes"]) * 60
            };
        }

        public async Task<AuthResponseDto?> RefreshToken(string refreshToken)
        {
            var storedToken = await _tokenService.ValidateRefreshToken(refreshToken);
            
            if (storedToken == null)
                return null;

            var user = storedToken.User;

            await _tokenService.RevokeRefreshToken(refreshToken);

            var accessToken = _tokenService.GenerateAccessToken(user);
            var newRefreshToken = await _tokenService.GenerateAndStoreRefreshToken(user.Id);

            return new AuthResponseDto
            {
                Id = user.Id,
                Name = user.FullName ,
                Email = user.Email,
                Role = user.Role,
                AccessToken = accessToken,
                RefreshToken = newRefreshToken.Token,
                ExpiresIn = Convert.ToInt32(_configuration["Jwt:AccessTokenExpiryMinutes"]) * 60
            };
        }

        public async Task<bool> Logout(string refreshToken)
        {
            await _tokenService.RevokeRefreshToken(refreshToken);
            return true;
        }

        public async Task<UserDto?> GetCurrentUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
                return null;

            return new UserDto
            {
                Id = user.Id,
                Name = user.FullName ,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> ChangePassword(int userId, string oldPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null || !VerifyPassword(oldPassword, user.PasswordHash))
                return false;

            user.PasswordHash = HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;
            
            await _tokenService.RevokeAllUserTokens(userId);
            
            await _context.SaveChangesAsync();
            
            return true;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}