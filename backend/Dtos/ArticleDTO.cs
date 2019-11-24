using System.Collections.Generic;

namespace FishersSite.Dtos
{
    public class ArticleDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public long UserId { get; set; }
        public ICollection<CommentDTO> Comments { get; set; }
    }
}