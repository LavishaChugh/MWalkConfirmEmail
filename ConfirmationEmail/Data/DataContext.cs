global using Microsoft.EntityFrameworkCore;
using ConfirmationEmail.Models;
namespace ConfirmationEmail.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<VerifyEmail>()
                .HasKey(u => u.Id);

            modelBuilder.Entity<VerifyEmail>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<VerifyEmail>()
               .Property(u => u.CreatedAt)
               .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<VerifyEmail>()
                .Property(u => u.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<VerifyEmail>()
                .Property(v => v.VerificationToken)
                .IsRequired();
        }

        public DbSet<VerifyEmail> verificationEmail {  get; set; }
    }
}
