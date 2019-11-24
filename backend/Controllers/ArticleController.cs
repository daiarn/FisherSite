using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using FishersSite.Models;
using FishersSite.Dtos;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FishersSite.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using FishersSite.Response;

namespace FishersSite.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/")]
    [ApiController]
    public class ArtileController : Controller
    {
        private IArticleService _articleService;

        public ArtileController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        [Route("Articles")]
        public ActionResult<ICollection<ArticleDTO>> Get()
        {
            return Ok(_articleService.GetArticles());
        }

        [HttpGet]
        [Route("Articles/{id}")]
        public ActionResult<ArticleDTO> Get(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var userOwnsPost = _articleService.UserOwnsArticle(id, userId);
            if (!userOwnsPost)
            {
                return BadRequest(new ErrorResponse(new ErrorModel{Message = "You do not own this article"}));
            }
            if (id <= 0)
            {
                return NotFound();
            }
            ArticleDTO article = _articleService.GetArticles().FirstOrDefault(a => a.Id == id);
            if (article == null)
            {
                return NotFound();
            }
            return Ok(article);
        }
        
        [HttpGet]
        [Route("Articles/{id}/Comments")]
        public ActionResult<IEnumerable<CommentDTO>> GetArticleComments(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var userOwnsPost = _articleService.UserOwnsArticle(id, userId);
            if (!userOwnsPost)
            {
                return BadRequest(new ErrorResponse(new ErrorModel{Message = "You do not own this article"}));
            }
            var comments = _articleService.GetArticleComments(id);
            if (comments == null)
            {
                return NotFound();
            }
            return Ok(comments);
        }

        [HttpGet]
        [Route("Articles/{articleId}/Comments/{commentId}")]
        public ActionResult<CommentDTO> GetArticleComment(int articleId, int commentId)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var userOwnsPost = _articleService.UserOwnsArticle(articleId, userId);
            if (!userOwnsPost)
            {
                return BadRequest(new ErrorResponse(new ErrorModel{Message = "You do not own this article"}));
            }
            if (articleId <= 0 || commentId <= 0)
            {
                return BadRequest();
            }
            CommentDTO comment = _articleService.GetArticleComments(articleId)
            .FirstOrDefault(c => c.Id == commentId);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }

        [HttpPost]
        [Route("Articles")]
        public async Task<ActionResult> Post([FromBody]Article article)
        {
            if (article == null)
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newArticle = await _articleService.PostArticle(article);
            return Ok(_articleService.GetArticle((int)newArticle.Id));
        }

        [HttpPut]
        [Route("Articles/{id}")]
        public async Task<ActionResult> Put(int id, [FromBody]Article article)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var userOwnsPost = _articleService.UserOwnsArticle(id, userId);
            if (!userOwnsPost)
            {
                return BadRequest(new ErrorResponse(new ErrorModel{Message = "You do not own this article"}));
            }
            if (article == null)
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newArticle = await _articleService.PutArticle(id, article);
            return Ok(newArticle);
        }

        [HttpDelete("{id}")]
        [Route("Articles/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var userOwnsPost = _articleService.UserOwnsArticle(id, userId);
            if (!userOwnsPost)
            {
                return BadRequest(new ErrorResponse(new ErrorModel{Message = "You do not own this article"}));
            }
            if (id <= 0)
            {
                return NotFound();
            }
            var deletedArticle = await _articleService.DeleteArticle(id);
            return Ok(deletedArticle);
        }

        ~ArtileController()
        {
        }
    }
}