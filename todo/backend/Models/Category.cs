using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// Categoria dei To‑Do (es. Lavoro, Casa...).
    /// Mappata alla tabella "category".
    /// </summary>
    [Table("category")]
    public class Category
    {
        /// <summary>
        /// Chiave primaria della categoria.
        /// </summary>
        [Column("id")]
        public int Id { get; set; }

        /// <summary>
        /// Nome della categoria (univoco a livello logico).
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Navigazione inversa: tutti i To‑Do collegati a questa categoria.
        /// </summary>
        public ICollection<Todo> Todos { get; set; } = new List<Todo>();
    }
}
