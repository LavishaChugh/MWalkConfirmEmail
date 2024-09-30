using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;
using System.Security.Cryptography;
using System.Text;

namespace ConfirmationEmail.EmailService
{
    public class VerificationEmail : IVerificationEmail
    {
        private readonly IConfiguration _configuration;

        public VerificationEmail(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendVerificationEmailAsync(string email, string token)
        {
            var verificationUrl = $"https://localhost:7129/api/VerificationEmail/verify?token={token}";

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_configuration["Brevo:FromName"], _configuration["Brevo:FromEmail"]));
            emailMessage.To.Add(MailboxAddress.Parse(email));
            emailMessage.Subject = "Email Verification";

            emailMessage.Body = new TextPart("html")
            {
                Text = $@"
                    <p>Dear {email},</p>
                    <p>Please verify your email address by clicking the following link:</p>
                    <p><a href='{verificationUrl}'>Verify Your Email Address</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Best regards,<br/>The Your App Team</p>"
            };

            using (var smtp = new SmtpClient())
            {
                await smtp.ConnectAsync("smtp-relay.brevo.com", 587, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync("7acbf1001@smtp-brevo.com", "q2fKVr4ZanITydUv");
                await smtp.SendAsync(emailMessage);
                await smtp.DisconnectAsync(true);
            }

        }


        public static string GenerateToken(int length = 32)
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] tokenData = new byte[length];
                rng.GetBytes(tokenData);

                var base64String = Convert.ToBase64String(tokenData);

                var alphanumericChars = new StringBuilder();
                foreach (char c in base64String)
                {
                    if (char.IsLetterOrDigit(c))
                    {
                        alphanumericChars.Append(c);
                    }
                }

                return alphanumericChars.ToString().Substring(0, Math.Min(length, alphanumericChars.Length));
            }
        }



    }
}
