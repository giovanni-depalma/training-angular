using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogBackend.Data;
using BlogBackend.Models;
using BlogBackend.Models.Dtos;

namespace BlogBackend.Controllers
{
    [ApiController]
    [Route("comments")]
    public class CommentsController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public CommentsController(BlogDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Crea un nuovo commento per un post esistente.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Comment>> Post([FromBody] CreateCommentInput input)
        {
            var exists = await _context.Posts.AnyAsync(p => p.Id == input.PostId);
            if (!exists)
            {
                return BadRequest($"PostId non valido: {input.PostId}");
            }

            var comment = new Comment
            {
                PostId = input.PostId,
                Author = input.Author,
                Content = input.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return Created($"/comments/{comment.Id}", comment);
        }
    }
}