using System.Collections.Generic;
using FishersSite.Dtos;
using FishersSite.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace FishersSite.Services
{
    public interface ICommentService
    {
        CommentDTO GetComment(int id);
        ICollection<CommentDTO> GetComments();
        Task<CommentDTO> PostComment(Comment comment);
        Task<CommentDTO> PutComment(int id, Comment comment);
        Task<Comment> DeleteComment(int id);
        bool UserOwnsComment(int commentId, string userId);
    }
}