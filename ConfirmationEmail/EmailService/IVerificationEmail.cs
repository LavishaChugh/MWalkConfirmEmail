namespace ConfirmationEmail.EmailService
{
    public interface IVerificationEmail
    {
        Task SendVerificationEmailAsync(string email, string token);
    }
}
