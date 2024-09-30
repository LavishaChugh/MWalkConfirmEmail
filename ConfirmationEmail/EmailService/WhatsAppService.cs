using System.Net.Http;
namespace ConfirmationEmail.EmailService
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "wxhuwq4c0icwd2mcojlx87raplply6vs"; 
        private readonly string _senderNumber = "+919530240053";

        public WhatsAppService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task SendOtpAsync(string phoneNumber, string otp)
        {
            var message = $"Your OTP code is: {otp}";
            var requestUri = $"https://api.gupshup.io/sm/api/v1/msg?apikey={_apiKey}&channel=whatsapp&message={message}&to={phoneNumber}&sender={_senderNumber}";

            var response = await _httpClient.PostAsync(requestUri, null);
            response.EnsureSuccessStatusCode();
        }
    }
}
