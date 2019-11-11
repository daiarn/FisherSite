using System.Collections.Generic;
using FishersSite.Dtos;
using FishersSite.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace FishersSite.Services
{
    public interface IUserService
    {
        Task<AuthenticationDTO> Login(string username, string password);
        Task<AuthenticationDTO> Register(User user, string password);
        Task<AuthenticationDTO> RefreshTokenAsync(string token, string refreshToken);
        UserDTO GetUser(long id);
        ICollection<UserDTO> GetUsers();
        ICollection<ArticleDTO> GetUserArticles(int id);
        ICollection<CommentDTO> GetUserCommentss(int id);
        ICollection<CommentDTO> GetUserArticleComments(int userId, int articleId);
        Task PostUser(User user);
        Task<UserDTO> PutUser(int id, User user);
        Task<User> DeleteUser(int id);
        bool isSameUser(int id, string userId);
    }
}