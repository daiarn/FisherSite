using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using FishersSite.Models;
using FishersSite.Dtos;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FishersSite.Services;

namespace FishersSite.Services
{
    public class CommentService : ICommentService
    {
        private FishersSiteContext _context;

        public CommentService(FishersSiteContext context)
        {
            _context = context;
        }

        public CommentDTO GetComment(int id)
        {
            return GetComments().FirstOrDefault(c => c.Id == id);
        }

        public ICollection<CommentDTO> GetComments()
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

        public async Task<CommentDTO> PostComment(Comment comment)
        {
            User user = _context.Users.FirstOrDefault(u => u.UserId == comment.User.UserId);
            if (user == null)
            {
                return null;
            }
            comment.User = user;
            Article article = _context.Articles.FirstOrDefault(a => a.Id == comment.Article.Id);
            if (article == null)
            {
                return null;
            }
            comment.Article = article;
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            return GetComment((int)comment.Id);
        }

        public async Task<CommentDTO> PutComment(int id, Comment comment)
        {
            Comment existingComment = _context.Comments.FirstOrDefault(c => c.Id == id);
            if (existingComment == null)
            {
                return null;
            }
            if (comment.Text != null)
            {
                existingComment.Text = comment.Text; 
            }            
            _context.Attach(existingComment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return GetComment(id);
        }
        public async Task<Comment> DeleteComment(int id)
        {
            Comment comment = _context.Comments.FirstOrDefault(c => c.Id == id);
            if (comment == null)
            {
                return null;
            }
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return comment;
        }
        public bool UserOwnsComment(int commentId, string userId)
        {
            var comment = GetComment(commentId);

            if (comment == null)
            {
                return false;
            }

            if (comment.UserId.ToString() != userId)
            {
                return false;
            }

            return true;
        }
        ~CommentService()
        {
            _context.Dispose();
        }
    }
}