using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FishersSite.Models
{
    [Table("Articles")]
    public class Article
    {
        [Key]
        public long Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public User User { get; set; }
        public ICollection<Comment> Comments { get; set; }
    }
}
