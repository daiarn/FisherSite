using Microsoft.EntityFrameworkCore;

namespace FishersSite.Models
{
    public class FishersSiteContext : DbContext
    {
        public FishersSiteContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Article> Articles {get; set;}
        public DbSet<User> Users {get; set;}
        public DbSet<Comment> Comments {get; set;}
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Article>().ToTable("Articles")
                .HasMany(a => a.Comments)
                .WithOne(c => c.Article)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Comment>().ToTable("Comments");
            modelBuilder.Entity<User>().ToTable("Users")
                .HasMany(u => u.Articles)
                .WithOne(a => a.User)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<RefreshToken>().ToTable("RefreshTokens");
        }
    }
}