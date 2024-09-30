namespace ConfirmationEmail.Models
{
    public class VerifyEmail
    {
        public Guid Id { get; set; } 
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsEmailVerified { get; set; } 
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; }
        public string VerificationToken { get; set; } = string.Empty; 
        public DateTime? TokenExpiration { get; set; }

    }
}
