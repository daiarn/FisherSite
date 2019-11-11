namespace FishersSite.Dtos
{
    public class CommentDTO
    {
        public long Id { get; set; }
        public string Text { get; set; }
        public long ArticleId { get; set; }
        public long UserId { get; set; }
    }
}