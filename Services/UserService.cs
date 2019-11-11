using System.Collections.Generic;
using FishersSite.Dtos;
using FishersSite.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using FishersSite.Helpers;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Text;

namespace FishersSite.Services
{
    public class UserService : IUserService
    {
        private FishersSiteContext _context;
        private TokenValidationParameters _tokenValidationParameters;
        private readonly AppSettings _appSettings;

        public UserService(FishersSiteContext context, TokenValidationParameters tokenValidationParameters, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _tokenValidationParameters = tokenValidationParameters;
            _appSettings = appSettings.Value;
        }
        public async Task<AuthenticationDTO> Login(string username, string password)
        {
             if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return new AuthenticationDTO
                {
                    Errors = new[] {"Missing username or password"}
                };

            var user = _context.Users.SingleOrDefault(x => x.Username == username);

            // check if username exists
            if (user == null)
                return new AuthenticationDTO
                {
                    Errors = new[] {"User does not exist"}
                };

            // check if password is correct
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return new AuthenticationDTO
                {
                    Errors = new[] {"User/password combination is wrong"}
                };
            
            var verifiedUser = GetUsers().SingleOrDefault(x => x.Username == username);
            // authentication successful
            return await GenerateAuthenticationResultForUserAsync(verifiedUser);
        }
        public async Task<AuthenticationDTO> Register(User user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                return new AuthenticationDTO
                {
                    Errors = new[] {"Password is required"}
                };

            if (_context.Users.Any(x => x.Username == user.Username))
                return new AuthenticationDTO
                {
                    Errors = new[] {"Username " + user.Username + " is already taken"}
                };

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.Role = Role.User;

            _context.Users.Add(user);
            _context.SaveChanges();

            var newUser = GetUsers().SingleOrDefault(x => x.Username == user.Username);

            return await GenerateAuthenticationResultForUserAsync(newUser);
        }
        public async Task<AuthenticationDTO> RefreshTokenAsync(string token, string refreshToken)
        {
            var validatedToken = GetPrincipalFromToken(token);

        if (validatedToken == null)
        {
            return new AuthenticationDTO {Errors = new[] {"Invalid Token"}};
        }

        var expiryDateUnix =
            long.Parse(validatedToken.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Exp).Value);

        var expiryDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            .AddSeconds(expiryDateUnix);

        if (expiryDateTimeUtc > DateTime.UtcNow)
        {
            return new AuthenticationDTO {Errors = new[] {"This token hasn't expired yet"}};
        }

        var jti = validatedToken.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

        var storedRefreshToken = await _context.RefreshTokens.SingleOrDefaultAsync(x => x.Token == refreshToken);

        if (storedRefreshToken == null)
        {
            return new AuthenticationDTO {Errors = new[] {"This refresh token does not exist"}};
        }

        if (DateTime.UtcNow > storedRefreshToken.ExpiryDate)
        {
            return new AuthenticationDTO {Errors = new[] {"This refresh token has expired"}};
        }

        if (storedRefreshToken.Invalidated)
        {
            return new AuthenticationDTO {Errors = new[] {"This refresh token has been invalidated"}};
        }

        if (storedRefreshToken.Used)
        {
            return new AuthenticationDTO {Errors = new[] {"This refresh token has been used"}};
        }

        if (storedRefreshToken.JwtId != jti)
        {
            return new AuthenticationDTO {Errors = new[] {"This refresh token does not match this JWT"}};
        }

        storedRefreshToken.Used = true;
        _context.RefreshTokens.Update(storedRefreshToken);
        await _context.SaveChangesAsync();
        long id = Convert.ToInt64(validatedToken.Claims.Single(x => x.Type == "id").Value);
        var user = GetUser(id);
        return await GenerateAuthenticationResultForUserAsync(user);
        }
        public UserDTO GetUser(long id)
        {
            if (id <= 0)
            {
                return null;
            }
            UserDTO user = GetUsers().FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return null;
            }
            return user;
        }
        public ICollection<UserDTO> GetUsers()
        {
            var comments = GetComments();
            var articles = GetArticles();
            var users = _context.Users
            .Select(user => new UserDTO
            {
                Id = user.UserId,
                Name = user.Name,
                Surname = user.Surname,
                Username = user.Username,
                Articles = articles.Where(a => a.UserId == user.UserId).ToList(),
                Comments = comments.Where(c => c.UserId == user.UserId).ToList(),
                Role = user.Role
            }).ToList();
            return users;
        }
        public ICollection<ArticleDTO> GetUserArticles(int id)
        {
            var comments = GetComments();
            var articles = _context.Articles.Include(a => a.User)
            .Select(article => new ArticleDTO{
                Id = article.Id,
                Title = article.Title,
                Text = article.Text,
                UserId = article.User.UserId,
                Comments = comments.Where(c => c.ArticleId == article.Id).ToList()
            }).Where(a => a.UserId == id).ToList();
            return articles;
        }
        private ICollection<CommentDTO> GetComments()
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
        private ICollection<ArticleDTO> GetArticles()
        {
            var comments = GetComments();
            var articles = _context.Articles.Include(a => a.User)
            .Select(article => new ArticleDTO{
                Id = article.Id,
                Title = article.Title,
                Text = article.Text,
                UserId = article.User.UserId,
                Comments = comments.Where(c => c.ArticleId == article.Id).ToList()
            }).ToList();
            return articles;
        }
        public ICollection<CommentDTO> GetUserCommentss(int id)
        {
            var comments = _context.Comments.Include(c => c.Article).Include(c => c.User)
            .Select(comment => new CommentDTO
            {
                Id = comment.Id,
                Text = comment.Text,
                ArticleId = comment.Article.Id,
                UserId = comment.User.UserId
            }).Where(c => c.UserId == id).ToList();
            return comments;
        }
        public ICollection<CommentDTO> GetUserArticleComments(int userId, int articleId)
        {
            var comments = GetUserArticles(userId)
            .FirstOrDefault(a => a.Id == articleId)
            .Comments.ToList();
            if (comments == null)
            {
                return null;
            }
            return comments;
        }
        public async Task PostUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
        public async Task<UserDTO> PutUser(int id, User user)
        {
            User existingUser = _context.Users.FirstOrDefault(u => u.UserId == id);
            if (existingUser == null)
            {
                return null;
            }
            if (user.Name != null)
            {
                existingUser.Name = user.Name;
            }
            if (user.Surname != null)
            {
                existingUser.Surname = user.Surname;
            }           
            _context.Attach(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return GetUser(id);
        }
        public async Task<User> DeleteUser(int id)
        {
            User user = _context.Users.FirstOrDefault(u => u.UserId == id);
            if (user == null)
            {
                return null;
            }
            List<Comment> comments = _context.Comments.Where(c => c.User.UserId == user.UserId).ToList();
            comments.ForEach(c => _context.Comments.Remove(c));
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public bool isSameUser(int id, string userId)
        {
            return id.ToString() == userId;
        }
        // private helper methods
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }

        private ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var tokenValidationParameters = _tokenValidationParameters.Clone();
                tokenValidationParameters.ValidateLifetime = false;
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);                if (!IsJwtWithValidSecurityAlgorithm(validatedToken))
                {
                    return null;
                }

                return principal;
            }
            catch
            {
                return null;
            }
        }

        private bool IsJwtWithValidSecurityAlgorithm(SecurityToken validatedToken)
        {
            return (validatedToken is JwtSecurityToken jwtSecurityToken) &&
                jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                    StringComparison.InvariantCultureIgnoreCase);
        }

        private async Task<AuthenticationDTO> GenerateAuthenticationResultForUserAsync(UserDTO user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] 
                {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("id", user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.Add(_appSettings.TokenLifetime),
                SigningCredentials = 
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);       

            var refreshToken = new RefreshToken
            {
                JwtId = token.Id,
                UserId = user.Id.ToString(),
                CreationDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddMonths(6)
            };

            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();
            
            return new AuthenticationDTO
            {
                Success = true,
                Token = tokenHandler.WriteToken(token),
                RefreshToken = refreshToken.Token
            };
        }

        ~UserService()
        {
            _context.Dispose();
        }
    }
}