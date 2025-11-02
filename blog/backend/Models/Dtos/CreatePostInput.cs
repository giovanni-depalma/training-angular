using System.ComponentModel.DataAnnotations;

namespace BlogBackend.Models.Dtos
{
    public class CreatePostInput
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Body { get; set; } = string.Empty;
    }
}