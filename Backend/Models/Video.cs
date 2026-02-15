using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Video
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public string VideoPath { get; set; } = string.Empty;
        
        public string VideoUrl { get; set; } = string.Empty;
        
        public string FileName { get; set; } = string.Empty;
        
        public long FileSize { get; set; }
        
        public string ContentType { get; set; } = string.Empty;
        
        public int Duration { get; set; }
        
        public int UserId { get; set; }
        public User? User { get; set; }
        
        public DateTime UploadedAt { get; set; }
        
        public ICollection<Annotation> Annotations { get; set; } = new List<Annotation>();
        public ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();
    }
}