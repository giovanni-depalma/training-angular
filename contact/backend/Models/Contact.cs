using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ContactBackend.Models
{
    [Table("contact")]
    public class Contact
    {
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("first_name")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        [EmailAddress]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("phone")]
        public string? Phone { get; set; }

        [JsonIgnore]
        public ICollection<ContactGroup> ContactGroups { get; set; } = new List<ContactGroup>();
    }
}
