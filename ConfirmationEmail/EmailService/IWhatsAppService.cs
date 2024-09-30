namespace ConfirmationEmail.EmailService
{
    public interface IWhatsAppService
    {
        public Task SendOtpAsync(string phoneNumber, string otp);
    }
}
