using System.Collections.Generic;

namespace FishersSite.Response
{
    public class AuthFailedResponse
    {
        public IEnumerable<string> Errors { get; set; }
    }
}