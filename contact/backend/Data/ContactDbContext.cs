using ContactBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ContactBackend.Data
{
    public class ContactDbContext : DbContext
    {
        public ContactDbContext(DbContextOptions<ContactDbContext> options) : base(options)
        {
        }

        public DbSet<Contact> Contacts { get; set; } = null!;
        public DbSet<Group> Groups { get; set; } = null!;
        public DbSet<ContactGroup> ContactGroups { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ContactGroup>()
                .HasKey(cg => new { cg.ContactId, cg.GroupId });

            modelBuilder.Entity<ContactGroup>()
                .HasOne(cg => cg.Contact)
                .WithMany(c => c.ContactGroups)
                .HasForeignKey(cg => cg.ContactId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ContactGroup>()
                .HasOne(cg => cg.Group)
                .WithMany(g => g.ContactGroups)
                .HasForeignKey(cg => cg.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
