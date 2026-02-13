using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
    [Key]
    public int Id { get; set; }
    public  required string FullName { get; set; }
    public required string Email { get; set; }
    public required  string PasswordHash { get; set; }
    public required string Role { get; set; } 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}