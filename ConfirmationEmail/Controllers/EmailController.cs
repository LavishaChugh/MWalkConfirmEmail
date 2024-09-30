using ConfirmationEmail.EmailService;
using ConfirmationEmail.Models;
using Microsoft.AspNetCore.Mvc;

namespace ConfirmationEmail.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            await _emailService.SendEmail(
                request.Body,
                request.SelectedDate,   
                request.PackageName,
                request.TotalCost,
                request.AdultCount,
                request.ChildCount,
                request.EmailAddress
            );

            return Ok();
        }
    }

}

