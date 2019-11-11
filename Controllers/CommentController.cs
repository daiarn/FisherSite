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
    [ApiController]
    [Route("api/")]
    public class CommentController : Controller
    {
        private ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        [Route("Comments")]
        public ActionResult<ICollection<CommentDTO>> Get()
        {
            return Ok(_commentService.GetComments());
        }

        [HttpGet]
        [Route("Comments/{id}")]
        public ActionResult<CommentDTO> Get(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var userOwnsPost = _commentService.UserOwnsComment(id, userId);
            if (!userOwnsPost)
            {
                return BadRequest(new ErrorResponse(new ErrorModel{Message = "You do not own this comment"}));
            }
            if (id <= 0)
            {
                return NotFound();
            }
            CommentDTO comment = _commentService.GetComment(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }

        [HttpPost]
        [Route("Comments")]
        public async Task<ActionResult<CommentDTO>> Post([FromBody]Comment comment)
        {
            if (comment == null)
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var newComment = await _commentService.PostComment(comment);
            return Ok(newComment);
        }

        [HttpPut]
        [Route("Comments/{id}")]
        public async Task<ActionResult<CommentDTO>> Put(int id, [FromBody]Comment comment)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var userOwnsPost = _commentService.UserOwnsComment(id, userId);
            if (!userOwnsPost)
            {
                return BadRequest(new ErrorResponse(new ErrorModel{Message = "You do not own this comment"}));
            }
            if (comment == null)
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newComment = await _commentService.PutComment(id, comment);
            return Ok(newComment);
        }

        [HttpDelete("{id}")]
        [Route("Comments/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var userOwnsPost = _commentService.UserOwnsComment(id, userId);
            if (!userOwnsPost)
            {
                return BadRequest(new ErrorResponse(new ErrorModel{Message = "You do not own this comment"}));
            }
            if (id <= 0)
            {
                return NotFound();
            }
            var deletedComment = await _commentService.DeleteComment(id);
            return Ok(deletedComment);
        }

        ~CommentController()
        {
        }
    }
}