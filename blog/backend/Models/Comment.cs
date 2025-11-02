using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BlogBackend.Models
{
    [Table("comment")]
    public class Comment
    {
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("post_id")]
        public int PostId { get; set; }

        // Prevent JSON cycles when serializing Posts with included Comments
        [JsonIgnore]
        public Post Post { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        [Column("author")]
        public string Author { get; set; } = string.Empty;

        [Required]
        [Column("content")]
        public string Content { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}