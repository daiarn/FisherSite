using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using FishersSite.Models;
using FishersSite.Dtos;
using FishersSite.Helpers;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FishersSite.Services;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;
using AutoMapper;
using Microsoft.Extensions.Options;
using FishersSite.Requests;
using FishersSite.Response;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace FishersSite.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("api/")]
    public class UserController : Controller
    {
        private IUserService _userService;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserDTO userDTO)
        {
            var authResponse = await _userService.Login(userDTO.Username, userDTO.Password);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken = authResponse.RefreshToken
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserDTO userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = ModelState.Values.SelectMany(x => x.Errors.Select(xx => xx.ErrorMessage))
                });
            }
            // map dto to entity
            var user = _mapper.Map<User>(userDto);

            var authResponse = await _userService.Register(user, userDto.Password);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken = authResponse.RefreshToken
            });
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
        {
            var authResponse = await _userService.RefreshTokenAsync(request.Token, request.RefreshToken);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken = authResponse.RefreshToken
            });
        }

        // [Authorize(Roles = Role.Admin)]
        //[AllowAnonymous]
        [HttpGet]
        [Route("Users")]
        public ActionResult<ICollection<UserDTO>> Get()
        {
            var users = _userService.GetUsers();
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }

        [HttpGet]
        [Route("Users/{id}")]
        public ActionResult<UserDTO> Get(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            if (!_userService.isSameUser(id, userId))
            {
                return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
            }
            if (id <= 0)
            {
                return NotFound();
            }
            UserDTO user = _userService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet]
        [Route("Users/{id}/Articles")]
        public ActionResult<IEnumerable<ArticleDTO>> GetUserArticles(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            if (!_userService.isSameUser(id, userId))
            {
                return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
            }
            var articles = _userService.GetUserArticles(id);
            if (articles == null)
            {
                return NotFound();
            }
            return Ok(articles);
        }

        [HttpGet]
        [Route("Users/{id}/Comments")]
        public ActionResult<IEnumerable<CommentDTO>> GetUserComments(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            if (!_userService.isSameUser(id, userId))
            {
                return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
            }
            var comments = _userService.GetUserCommentss(id);
            if (comments == null)
            {
                return NotFound();
            }
            return Ok(comments);
        }

        [HttpGet]
        [Route("Users/{userId}/Articles/{articleId}")]
        public ActionResult<ArticleDTO> GetUserArticle(int userId, int articleId)
        {
            var senderId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            if (!_userService.isSameUser(userId, senderId))
            {
                return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
            }
            ArticleDTO article = _userService.GetUserArticles(userId).FirstOrDefault(a => a.Id == articleId);
            if (article == null)
            {
                return NotFound();
            }
            return Ok(article);
        }

        [HttpGet]
        [Route("Users/{userId}/Comments/{commentId}")]
        public ActionResult<ArticleDTO> GetUserComment(int userId, int commentId)
        {
            var senderId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            if (!_userService.isSameUser(userId, senderId))
            {
                return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
            }
            CommentDTO comment = _userService.GetUserCommentss(userId).FirstOrDefault(c => c.Id == commentId);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }

        [HttpGet]
        [Route("Users/{userId}/Articles/{articleId}/Comments")]
        public ActionResult<IEnumerable<CommentDTO>> GetUserArticleComments(int userId, int articleId)
        {
            var senderId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            if (!_userService.isSameUser(userId, senderId))
            {
                return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
            }
            var comments = _userService.GetUserArticleComments(userId, articleId);
            if (comments == null)
            {
                return BadRequest();
            }
            return Ok(comments);
        }

        [HttpGet]
        [Route("Users/{userId}/Articles/{articleId}/Comments/{commentId}")]
        public ActionResult<CommentDTO> GetUserArticleComment(int userId, int articleId, int commentId)
        {
            var senderId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            if (!_userService.isSameUser(userId, senderId))
            {
                return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
            }
            var comment = _userService.GetUserArticleComments(userId, articleId).FirstOrDefault(c => c.Id == commentId);
            if (comment == null)
            {
                return BadRequest();
            }
            return Ok(comment);
        }

        [HttpPut]
        [Route("Users/{id}")]
        public async Task<ActionResult<UserDTO>> Put(int id, [FromBody]User user)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            if (!_userService.isSameUser(id, userId))
            {
                return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
            }
            if (user == null)
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            UserDTO existingUser = await _userService.PutUser(id, user);
            if (existingUser == null)
            {
                return NotFound();
            }
            return Ok(existingUser);
        }

        [HttpDelete("{id}")]
        [Route("Users/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var userId = HttpContext.User.Claims.Single(x => x.Type == "id").Value;
            var isAdmin = HttpContext.User.Claims.Single(x => x.Type == ClaimTypes.Role).Value;
            if (isAdmin != "Admin")
            {
                if (!_userService.isSameUser(id, userId))
                {
                    return BadRequest(new ErrorResponse(new ErrorModel { Message = "You are not this user" }));
                }
            }

            if (id <= 0)
            {
                return NotFound();
            }
            User deletedUser = await _userService.DeleteUser(id);
            if (deletedUser == null)
            {
                return NotFound();
            }
            return Ok(deletedUser);
        }

        ~UserController()
        {
        }
    }
}