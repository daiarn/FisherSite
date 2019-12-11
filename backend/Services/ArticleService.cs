using System.Collections.Generic;
using FishersSite.Dtos;
using FishersSite.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace FishersSite.Services
{
    public class ArticleService : IArticleService
    {
        private FishersSiteContext _context;

        public ArticleService(FishersSiteContext context)
        {
            _context = context;
        }

        public ArticleDTO GetArticle(int id)
        {
            if (id <= 0)
            {
                return null;
            }
            ArticleDTO article = GetArticles().FirstOrDefault(u => u.Id == id);
            if (article == null)
            {
                return null;
            }
            return article;
        }
        public ICollection<ArticleDTO> GetArticles()
        {
            var comments = GetComments();
            var articles = _context.Articles.Include(a => a.User)
            .Select(article => new ArticleDTO
            {
                Id = article.Id,
                Title = article.Title,
                Text = article.Text,
                UserId = article.User.UserId,
                Comments = comments.Where(c => c.ArticleId == article.Id).ToList()
            }).ToList();
            return articles;
        }
        private ICollection<CommentDTO> GetComments()
        {
            var comments = _context.Comments.Include(c => c.Article).Include(c => c.User)
            .Select(comment => new CommentDTO
            {
                Id = comment.Id,
                Text = comment.Text,
                ArticleId = comment.Article.Id,
                UserId = comment.User.UserId
            }).ToList();
            return comments;
        }
        public ICollection<CommentDTO> GetArticleComments(int id)
        {
            return GetComments().Where(c => c.ArticleId == id).ToList();
        }

        public async Task<ArticleDTO> PostArticle(Article article)
        {
            User user = _context.Users.FirstOrDefault(u => u.UserId == article.User.UserId);//UserId neturim kažkodėl? 

            if (user == null)
            {
                return null;
            }
            article.User = user;
            await _context.Articles.AddAsync(article);
            await _context.SaveChangesAsync();
            return GetArticle((int)article.Id);
        }

        public async Task<ArticleDTO> PutArticle(int id, Article article)
        {
            Article existingArticle = _context.Articles.FirstOrDefault(a => a.Id == id);
            if (existingArticle == null)
            {
                return null;
            }
            if (article.Title != null)
            {
                existingArticle.Title = article.Title;
            }
            if (article.Text != null)
            {
                existingArticle.Text = article.Text;
            }
            _context.Attach(existingArticle).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return GetArticle(id);
        }

        public async Task<Article> DeleteArticle(int id)
        {
            Article article = _context.Articles.FirstOrDefault(a => a.Id == id);
            if (article == null)
            {
                return null;
            }
            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public bool UserOwnsArticle(int articleId, string userId)
        {
            var article = GetArticle(articleId);

            if (article == null)
            {
                return false;
            }

            if (article.UserId.ToString() != userId)
            {
                return false;
            }

            return true;
        }
        ~ArticleService()
        {
            _context.Dispose();
        }
    }
}