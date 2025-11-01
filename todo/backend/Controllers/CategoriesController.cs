using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Linq;

namespace Backend.Controllers
{
    /// <summary>
    /// REST controller per esporre le categorie.
    /// </summary>
    [ApiController]
    [Route("categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly TodoDbContext _context;

        public CategoriesController(TodoDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Restituisce tutte le categorie disponibili.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> Get()
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Name)
                .ToListAsync();
            return Ok(categories);
        }
    }
}
