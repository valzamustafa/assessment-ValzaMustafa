using Backend.DTOs.Annotation;

namespace Backend.Services
{
    public interface IAnnotationService
    {
        Task<AnnotationResponseDto> CreateAnnotation(int userId, string userName, CreateAnnotationDto request);
        Task<List<AnnotationResponseDto>> GetVideoAnnotations(int videoId);
        Task<List<AnnotationResponseDto>> GetAllAnnotations();
        Task<bool> DeleteAnnotation(int id, int userId, bool isAdmin);
    }
}