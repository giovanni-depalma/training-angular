using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    /// <summary>
    /// EF Core DbContext: rappresenta la sessione verso il database.
    /// Contiene i DbSet (tabelle) e le regole di mapping tra modelli e schema SQL.
    /// </summary>
    public class TodoDbContext : DbContext
    {
        /// <summary>
        /// Il contesto viene creato da ASP.NET Core DI con le opzioni configurate in Program.cs
        /// (UseNpgsql + connection string da appsettings.json).
        /// </summary>
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// Tabella dei To‑Do.
        /// </summary>
        public DbSet<Todo> Todos { get; set; } = null!;

        /// <summary>
        /// Tabella delle Categorie.
        /// </summary>
        public DbSet<Category> Categories { get; set; } = null!;

        /// <summary>
        /// Configurazione del modello: qui definiamo relazioni e comportamenti.
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relazione: un To‑Do ha (opzionalmente) una Category; una Category ha molti To‑Do.
            // OnDelete(SetNull): se una categoria viene eliminata, i To‑Do collegati non vengono cancellati,
            // ma il loro CategoryId diventa NULL.
            modelBuilder.Entity<Todo>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Todos)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
