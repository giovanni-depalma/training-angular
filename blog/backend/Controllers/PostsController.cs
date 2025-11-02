using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogBackend.Data;
using BlogBackend.Models;
using BlogBackend.Models.Dtos;

namespace BlogBackend.Controllers
{
    [ApiController]
    [Route("posts")]
    public class PostsController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public PostsController(BlogDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Restituisce l'elenco dei post ordinati per data di creazione decrescente includendo i commenti.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> Get()
        {
            var posts = await _context.Posts
                .Include(p => p.Comments)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
            return Ok(posts);
        }

        /// <summary>
        /// Crea un nuovo post.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Post>> Post([FromBody] CreatePostInput input)
        {
            var post = new Post
            {
                Title = input.Title,
                Body = input.Body,
                CreatedAt = DateTime.UtcNow
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return Created($"/posts/{post.Id}", post);
        }

        /// <summary>
        /// Elimina un post esistente (i commenti verranno rimossi in cascata).
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}