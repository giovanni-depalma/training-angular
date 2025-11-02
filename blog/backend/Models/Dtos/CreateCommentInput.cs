using System.ComponentModel.DataAnnotations;

namespace BlogBackend.Models.Dtos
{
    public class CreateCommentInput
    {
        [Required]
        public int PostId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Author { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;
    }
}