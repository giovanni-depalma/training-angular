using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ContactBackend.Models
{
    [Table("group")] // quoted table name in SQL, map via attribute
    public class Group
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<ContactGroup> ContactGroups { get; set; } = new List<ContactGroup>();
    }
}
