using System.ComponentModel.DataAnnotations.Schema;

namespace ContactBackend.Models
{
    [Table("contact_group")]
    public class ContactGroup
    {
        [Column("contact_id")]
        public int ContactId { get; set; }
        public Contact Contact { get; set; } = null!;

        [Column("group_id")]
        public int GroupId { get; set; }
        public Group Group { get; set; } = null!;
    }
}
