using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactBackend.Data;
using ContactBackend.Models;

namespace ContactBackend.Controllers
{
    [ApiController]
    [Route("groups")]
    public class GroupsController : ControllerBase
    {
        private readonly ContactDbContext _context;

        public GroupsController(ContactDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Group>>> Get()
        {
            var groups = await _context.Groups
                .OrderBy(g => g.Name)
                .ToListAsync();
            return Ok(groups);
        }
    }
}
