using Backend.DTOs.Auth;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> Register(RegisterDto request);
        Task<LoginResponseDto> Login(LoginDto request);
    }
}