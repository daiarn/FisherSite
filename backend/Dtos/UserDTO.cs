using System.Collections.Generic;

namespace FishersSite.Dtos
{
    public class UserDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public ICollection<ArticleDTO> Articles { get; set; }
        public ICollection<CommentDTO> Comments { get; set; }
    }
}