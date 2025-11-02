using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactBackend.Data;
using ContactBackend.Models;
using ContactBackend.Models.Dtos;

namespace ContactBackend.Controllers
{
    [ApiController]
    [Route("contacts")]
    public class ContactsController : ControllerBase
    {
        private readonly ContactDbContext _context;

        public ContactsController(ContactDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Restituisce la lista dei contatti. Se fornito, filtra per gruppo (groupId).
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> Get([FromQuery] int? groupId)
        {
            var query = _context.Contacts.AsQueryable();

            if (groupId.HasValue)
            {
                query = query.Where(c => c.ContactGroups.Any(cg => cg.GroupId == groupId.Value));
            }

            // Ordiniamo alfabeticamente per cognome, nome
            query = query
                .OrderBy(c => c.LastName)
                .ThenBy(c => c.FirstName);

            return await query.ToListAsync();
        }

        /// <summary>
        /// Crea un nuovo contatto e, opzionalmente, associa uno o più gruppi.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Contact>> Post([FromBody] CreateContactInput input)
        {
            var contact = new Contact
            {
                FirstName = input.FirstName,
                LastName = input.LastName,
                Email = input.Email,
                Phone = input.Phone
            };

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            // Associazioni gruppi se presenti
            if (input.GroupIds != null && input.GroupIds.Count > 0)
            {
                foreach (var gid in input.GroupIds.Distinct())
                {
                    // Verifica esistenza gruppo (opzionale, ma utile a dare 400 se inesistente)
                    var exists = await _context.Groups.AnyAsync(g => g.Id == gid);
                    if (!exists)
                    {
                        return BadRequest($"GroupId non valido: {gid}");
                    }
                    _context.ContactGroups.Add(new ContactGroup { ContactId = contact.Id, GroupId = gid });
                }
                await _context.SaveChangesAsync();
            }

            return Created($"/contacts/{contact.Id}", contact);
        }

        /// <summary>
        /// Elimina un contatto. Le relazioni nella tabella ponte vengono eliminate in cascata.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
