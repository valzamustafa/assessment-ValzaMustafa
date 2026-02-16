using Backend.DTOs.Video;

namespace Backend.Services
{
    public interface IVideoService
    {
        Task<VideoResponseDto> UploadVideo(int userId, CreateVideoDto createVideoDto);
        Task<IEnumerable<VideoResponseDto>> GetAllVideos();
        Task<IEnumerable<VideoResponseDto>> GetUserVideos(int userId);
        Task<VideoResponseDto?> GetVideoById(int id);
        Task<bool> DeleteVideo(int id, int userId, bool isAdmin);
    }
}