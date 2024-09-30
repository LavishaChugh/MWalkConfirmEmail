using Microsoft.AspNetCore.Mvc;
using Twilio;
using Twilio.Rest.Verify.V2.Service;
using System;
using Twilio.Types;
using Twilio.Rest.Api.V2010.Account;

namespace ConfirmationEmail.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Otp : ControllerBase
    {
        private readonly string _accountSid = "AC9cfe61cc2ae8525836634c4a6bddf2fe";
        private readonly string _authToken = "9378afc6da05f208a898f2ef3e48c8ee";
        private readonly string _whatsappFromNumber = "+14318147548";

        public Otp()
        {
            // Initialize Twilio client with environment variables
            //_accountSid = Environment.GetEnvironmentVariable("AC9cfe61cc2ae8525836634c4a6bddf2fe");
            //_authToken = Environment.GetEnvironmentVariable("9378afc6da05f208a898f2ef3e48c8ee");
            //_whatsappFromNumber = Environment.GetEnvironmentVariable("+14318147548");

            TwilioClient.Init(_accountSid, _authToken);
        }

        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] OtpRequest otpRequest)
        {
            try
            {
                // Generate a random OTP code
                var otp = new Random().Next(100000, 999999).ToString();

                // Send OTP via WhatsApp
                var message = MessageResource.Create(
                    body: $"Your OTP code is {otp}",
                    from: new PhoneNumber($"whatsapp:{_whatsappFromNumber}"),
                    to: new PhoneNumber($"whatsapp:{otpRequest.To}")
                );

                return Ok(new { message.Sid, OTP = otp });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class OtpRequest
    {
        public string To { get; set; } // Phone number in E.164 format
    }
}