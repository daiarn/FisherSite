using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FishersSite.Models
{
    [Table("Comments")]
    public class Comment
    {
        [Key]
        public long Id { get; set; }
        public string Text { get; set; }
        public Article Article { get; set; }
        public User User { get; set; }
    }
}
