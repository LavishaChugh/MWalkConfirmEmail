namespace ConfirmationEmail.Models
{
    public class PhoneNoOtp
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string OtpCode { get; set; }
        public DateTime OtpExpiration { get; set; }
    }
}
