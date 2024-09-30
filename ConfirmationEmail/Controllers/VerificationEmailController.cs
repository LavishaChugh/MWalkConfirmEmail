using ConfirmationEmail.Data;
using ConfirmationEmail.EmailService;
using ConfirmationEmail.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace ConfirmationEmail.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerificationEmailController : Controller
    {
        private readonly DataContext _context;
        private readonly IVerificationEmail _emailService;

        public VerificationEmailController(DataContext context, IVerificationEmail emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] VerifyEmail user)
        {
            if (user == null)
                return BadRequest("User data is required.");

            using (var hmac = new HMACSHA512())
            {
                user.PasswordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(user.PasswordHash)));
            }

            // Check if the email already exists
            var existingUser = await _context.verificationEmail
                .SingleOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
            {
                // If the email is found and is not verified, update the existing record
                if (!existingUser.IsEmailVerified)
                {
                    // Generate a new verification token and set the new expiration
                    var newToken = VerificationEmail.GenerateToken();
                    existingUser.VerificationToken = newToken;
                    existingUser.TokenExpiration = DateTime.UtcNow.AddHours(24); // Set new expiration time
                    existingUser.UpdatedAt = DateTime.UtcNow;

                    // Save changes to update the record
                    _context.verificationEmail.Update(existingUser);
                    await _context.SaveChangesAsync();

                    // Send the verification email with the new token
                    await _emailService.SendVerificationEmailAsync(existingUser.Email, newToken);

                    return Ok(new { success = true, message = "Registration successful. Please check your email to verify your account." });
                }
                else
                {
                    return BadRequest("Email is already verified. Please use a different email to register.");
                }
            }
            else
            {
                // If the email does not exist, create a new record
                var newToken = VerificationEmail.GenerateToken();
                user.VerificationToken = newToken;
                user.TokenExpiration = DateTime.UtcNow.AddHours(24);
                user.CreatedAt = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;

                _context.verificationEmail.Add(user);
                await _context.SaveChangesAsync();

                await _emailService.SendVerificationEmailAsync(user.Email, newToken);

                return Ok(new { success = true, message = "Registration successful. Please check your email to verify your account." });
            }
        }


        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            var user = await _context.verificationEmail.SingleOrDefaultAsync(u => u.VerificationToken == token && u.TokenExpiration > DateTime.UtcNow);

            if (user == null)
                return BadRequest("Invalid or expired token.");

            try
            {
                // Try to render the view first
                var viewResult = View("VerificationSuccess");

                if (viewResult == null)
                {
                    return BadRequest("Verification page not found.");
                }


                user.IsEmailVerified = true;
                user.VerificationToken = token; 
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return viewResult;
            }
            catch (Exception ex)
            {
                // Log the error for debugging purposes
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while verifying your email. Please try again later.");
            }
        }

    }
}

