using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    /// <summary>
    /// REST controller per gestire i To‑Do.
    /// Espone gli endpoint GET/POST/DELETE su /todos.
    /// </summary>
    [ApiController]
    [Route("todos")]
    public class TodosController : ControllerBase
    {
        private readonly TodoDbContext _context;

        /// <summary>
        /// Costruttore con Dependency Injection del DbContext.
        /// </summary>
        public TodosController(TodoDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Restituisce la lista dei To‑Do con filtri opzionali per categoria.
        /// </summary>
        /// <param name="categoryId">Id della categoria a cui il To‑Do appartiene.</param>
        /// <param name="categoryName">Nome della categoria (alternativo a categoryId).</param>
        /// <returns>Elenco di To‑Do ordinati per data di creazione decrescente.</returns>
        /// <remarks>
        /// Esempi:
        /// - GET /todos
        /// - GET /todos?categoryId=1
        /// - GET /todos?categoryName=Lavoro
        /// </remarks>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> Get(
            [FromQuery] int? categoryId,
            [FromQuery] string? categoryName)
        {
            // Partiamo dalla query base su tutti i To‑Do
            var query = _context.Todos.AsQueryable();

            // Applichiamo il filtro SOLO se presente
            if (categoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == categoryId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(categoryName))
            {
                // Nota: confrontiamo per uguaglianza esatta del nome
                query = query.Where(t => t.Category != null && t.Category!.Name == categoryName);
            }

            // Ordinamento di default: dal più recente al meno recente
            query = query.OrderByDescending(t => t.CreatedAt);

            return await query.ToListAsync();
        }

        /// <summary>
        /// Crea un nuovo To‑Do.
        /// </summary>
        /// <param name="todo">Oggetto To‑Do da creare (title obbligatorio, opzionale categoryId).</param>
        /// <returns>Il To‑Do creato con URL della risorsa.</returns>
        [HttpPost]
        public async Task<ActionResult<Todo>> Post([FromBody] Todo todo)
        {
            // [ApiController] valida automaticamente ModelState in base agli attributi del modello
            // Forziamo la data di creazione lato server per coerenza
            todo.CreatedAt = DateTime.UtcNow;
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();
            return Created($"/todos/{todo.Id}", todo);
        }

        /// <summary>
        /// Elimina un To‑Do esistente.
        /// </summary>
        /// <param name="id">Id del To‑Do da eliminare.</param>
        /// <returns>204 No Content se eliminato, 404 se non trovato.</returns>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null) return NotFound();

            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
