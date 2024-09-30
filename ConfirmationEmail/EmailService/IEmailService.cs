namespace ConfirmationEmail.EmailService
{
    public interface IEmailService
    {
        public Task SendEmail(string body, DateTime selectedDate, string packageName, decimal totalCost, int adultCount, int childCount, string emailAddress);



    }
}
