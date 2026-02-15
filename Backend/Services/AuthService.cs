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
            try
            {
                Console.WriteLine($"=== REGISTER ATTEMPT ===");
                Console.WriteLine($"Email: {registerDto.Email}");
                Console.WriteLine($"Name: {registerDto.Name}");

                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

                if (existingUser != null)
                {
                    Console.WriteLine($"User already exists: {registerDto.Email}");
                    return null;
                }

                var user = new User
                {
                    FullName = registerDto.Name,
                    Email = registerDto.Email,
                    PasswordHash = HashPassword(registerDto.Password),
                    Role = "user",
                    CreatedAt = DateTime.UtcNow
                };

                Console.WriteLine($"Creating user: {user.Email}");

                _context.Users.Add(user);
                
                var saveResult = await _context.SaveChangesAsync();
                Console.WriteLine($"SaveChanges result: {saveResult} users saved");

                if (saveResult == 0)
                {
                    Console.WriteLine("ERROR: No changes saved to database!");
                    return null;
                }

                Console.WriteLine($"User saved with ID: {user.Id}");

                var accessToken = _tokenService.GenerateAccessToken(user);
                var refreshToken = await _tokenService.GenerateAndStoreRefreshToken(user.Id);

                return new AuthResponseDto
                {
                    Id = user.Id,
                    Name = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken.Token,
                    ExpiresIn = Convert.ToInt32(_configuration["Jwt:AccessTokenExpiryMinutes"]) * 60
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in Register: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<AuthResponseDto?> Login(LoginDto loginDto)
        {
            try
            {
                Console.WriteLine($"=== LOGIN ATTEMPT ===");
                Console.WriteLine($"Email: {loginDto.Email}");

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null)
                {
                    Console.WriteLine($"User not found: {loginDto.Email}");
                    return null;
                }

                Console.WriteLine($"User found: ID={user.Id}, Role={user.Role}");

                if (!VerifyPassword(loginDto.Password, user.PasswordHash))
                {
                    Console.WriteLine("Invalid password");
                    return null;
                }

                Console.WriteLine("Password verified");

                await _tokenService.RevokeAllUserTokens(user.Id);

                var accessToken = _tokenService.GenerateAccessToken(user);
                var refreshToken = await _tokenService.GenerateAndStoreRefreshToken(user.Id);

                return new AuthResponseDto
                {
                    Id = user.Id,
                    Name = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken.Token,
                    ExpiresIn = Convert.ToInt32(_configuration["Jwt:AccessTokenExpiryMinutes"]) * 60
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in Login: {ex.Message}");
                return null;
            }
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
                Name = user.FullName,
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
                Name = user.FullName,
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