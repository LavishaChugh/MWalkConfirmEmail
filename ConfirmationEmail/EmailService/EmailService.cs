using System.Text;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Threading.Tasks;
using System;

namespace ConfirmationEmail.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmail(string body, DateTime selectedDate, string packageName, decimal totalCost, int adultCount, int childCount, string emailAddress)
        {
            try
            {

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_configuration["Brevo:FromName"], _configuration["Brevo:FromEmail"]));
                email.To.Add(MailboxAddress.Parse(emailAddress));
                var fixedEmailAddress = _configuration["Brevo:FixedEmail"]; 
                if (!string.IsNullOrEmpty(fixedEmailAddress))
                {
                    email.Cc.Add(MailboxAddress.Parse(fixedEmailAddress)); 
                }
                email.Subject = "MWalk - Package Confirmation!";
                email.Body = new TextPart(TextFormat.Html) { Text = FormatEmailBody(body, packageName, totalCost, adultCount, childCount, emailAddress, selectedDate) };

                using (var smtp = new SmtpClient())
                {
                    await smtp.ConnectAsync("smtp-relay.brevo.com", 587, SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync("7acbf1001@smtp-brevo.com", "q2fKVr4ZanITydUv");
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                }

                Console.WriteLine("Email sent successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SMTP Command Error: {ex.Message}");
            }
        }

        private string FormatEmailBody(string body, string packageName, decimal totalCost, int adultCount, int childCount, string emailAddress, DateTime selectedDate)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<p>Thank you for booking with MWalk. We are delighted to confirm your reservation and look forward to providing you with an exceptional experience.</p>");
            sb.AppendLine("<p>Your booking details are as follows:</p>");
            sb.AppendLine($"<p><strong>Package Name:</strong> {packageName}</p>");
            sb.AppendLine($"<p><strong>Total Cost:</strong> ${totalCost}</p>");
            sb.AppendLine($"<p><strong>Number of Adults:</strong> {adultCount}</p>");
            sb.AppendLine($"<p><strong>Number of Children:</strong> {childCount}</p>");
            sb.AppendLine($"<p><strong>Selected Date:</strong> {selectedDate:MM/dd/yyyy}</p>");
            sb.AppendLine($"<p><strong>Email Address:</strong> {emailAddress}</p>");
            sb.AppendLine("<p>Thank you for choosing MWalk. We are excited to welcome you to your destination and help you explore some of the world’s finest places. Our Team will contact with you soon!</p>");
            sb.AppendLine("<p>Best regards,<br/><strong>The MWalk Team</strong></p>");

            return sb.ToString();
        }


    }
}