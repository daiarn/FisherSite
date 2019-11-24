using System.Collections.Generic;

namespace FishersSite.Dtos
{
    public class AuthenticationDTO
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }

        public bool Success { get; set; }

        public IEnumerable<string> Errors { get; set; }
    }
}