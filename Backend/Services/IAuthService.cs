using Backend.DTOs;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> Register(RegisterDto registerDto);
        Task<AuthResponseDto?> Login(LoginDto loginDto);
        Task<AuthResponseDto?> RefreshToken(string refreshToken);
        Task<bool> Logout(string refreshToken);
        Task<UserDto?> GetCurrentUser(int userId);
        Task<bool> ChangePassword(int userId, string oldPassword, string newPassword);
    }
}