using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// Modello/Entity dei To‑Do.
    /// Mappato alla tabella "todo" con nomi colonna in snake_case per allinearsi allo schema SQL.
    /// </summary>
    [Table("todo")]
    public class Todo
    {
        /// <summary>
        /// Chiave primaria del To‑Do.
        /// </summary>
        [Column("id")]
        public int Id { get; set; }

        /// <summary>
        /// Titolo/descrizione breve del To‑Do.
        /// </summary>
        [Required]
        [MaxLength(200)]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Stato di completamento (true se completato).
        /// </summary>
        [Column("completed")]
        public bool Completed { get; set; }

        /// <summary>
        /// Data di creazione impostata dal server in UTC.
        /// </summary>
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// FK opzionale verso la categoria.
        /// </summary>
        [Column("category_id")]
        public int? CategoryId { get; set; }

        /// <summary>
        /// Navigazione EF Core alla categoria (può essere null se non assegnata).
        /// </summary>
        public Category? Category { get; set; }
    }
}
