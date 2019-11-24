using System.Collections.Generic;
using System.Threading.Tasks;
using FishersSite.Dtos;
using FishersSite.Models;

namespace FishersSite.Services
{
    public interface IArticleService
    {
        ArticleDTO GetArticle(int id);
        ICollection<ArticleDTO> GetArticles();
        ICollection<CommentDTO> GetArticleComments(int id);
        Task<ArticleDTO> PostArticle(Article article);
        Task<ArticleDTO> PutArticle(int id, Article article);
        Task<Article> DeleteArticle(int id);
        bool UserOwnsArticle(int articleId, string userId);
    }
}