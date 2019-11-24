using System;

namespace FishersSite.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public TimeSpan TokenLifetime { get; set; }
    }
}