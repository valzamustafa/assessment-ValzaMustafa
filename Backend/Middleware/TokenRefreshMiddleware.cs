using Backend.Services;
using System.Security.Claims;

namespace Backend.Middleware
{
    public class TokenRefreshMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TokenRefreshMiddleware> _logger;

        public TokenRefreshMiddleware(RequestDelegate next, ILogger<TokenRefreshMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, ITokenService tokenService)
        {
      
            if (!context.Request.Headers.ContainsKey("Authorization"))
            {
                await _next(context);
                return;
            }

            var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                await _next(context);
                return;
            }

            var userId = tokenService.GetUserIdFromToken(token);
            if (userId.HasValue)
            {
              
            }

            await _next(context);
        }
    }
}