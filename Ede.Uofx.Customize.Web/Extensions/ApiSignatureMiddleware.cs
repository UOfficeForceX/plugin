using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using TimeZoneConverter;

namespace Ede.Uofx.Customize.Web.Extensions
{
    public class ApiSignatureMiddleware
    {
        private readonly RequestDelegate _next;
        const string apikey = "SampleAdvanced";

        public ApiSignatureMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if( !context.Request.Headers.TryGetValue("X-Signature", out var signature))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("signature was not provided");
                return;
            }
            if (!context.Request.Headers.TryGetValue("X-Timestamp", out var times))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("timestamp was not provided");
                return;
            }

            //首先將它們依照指定格式組成字串後，
            //接下來拿 API Key 作為 Key 使用 HMAC - SHA256 計算出 Signature
            var compareSignature = times.ToString().HMACSHA256(apikey);
            var requestsignature = signature;

            if (requestsignature != compareSignature)
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Signature verify fail.");
                return;
            }
            //檢查timestamp和server相差不超過五分鐘
            TimeZoneInfo TimeZone = TZConvert.GetTimeZoneInfo("Taipei Standard Time");
            DateTimeOffset d2 = DateTimeOffset.Parse(times, null, System.Globalization.DateTimeStyles.RoundtripKind);
            var d1 = d2.ToOffset(TimeZone.BaseUtcOffset);
            TimeSpan ts = DateTimeOffset.Now.Subtract(d1);
            if (ts.TotalMinutes > 5)
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("timestamp expired");
                return;
            }
            await _next.Invoke(context);

        }
    }
}
