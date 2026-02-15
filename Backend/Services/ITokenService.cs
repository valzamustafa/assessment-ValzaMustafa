using Backend.Models;

namespace Backend.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        Task<RefreshToken> GenerateAndStoreRefreshToken(int userId);
        Task<RefreshToken?> ValidateRefreshToken(string token);
        Task RevokeRefreshToken(string token);
        Task RevokeAllUserTokens(int userId);
        bool ValidateToken(string token);
        int? GetUserIdFromToken(string token);
    }
}