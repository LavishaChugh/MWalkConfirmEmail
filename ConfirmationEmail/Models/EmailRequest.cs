namespace ConfirmationEmail.Models
{
    public class EmailRequest
    {
        public string Body { get; set; }
        public string SenderEmail { get; set; }
        public string PackageName { get; set; }
        public decimal TotalCost { get; set; }
        public int AdultCount { get; set; }
        public int ChildCount { get; set; }
        public DateTime SelectedDate { get; set; }
        public string EmailAddress { get; set; }
    }
}
