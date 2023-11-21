using System.Security.Cryptography;
using System.Text;

namespace Ede.Uofx.Customize.Web.Extensions
{
    public static class ExtensionMethods
    {
        public static string HMACSHA256(this string message, string key)
        {

            byte[] keyByte = Encoding.UTF8.GetBytes(key);
            byte[] messageBytes = Encoding.UTF8.GetBytes(message);
            using (var hmacSHA256 = new HMACSHA256(keyByte))
            {
                byte[] hashMessage = hmacSHA256.ComputeHash(messageBytes);
                return BitConverter.ToString(hashMessage).Replace("-", "").ToLower();
            }
        }


       
    }
}
