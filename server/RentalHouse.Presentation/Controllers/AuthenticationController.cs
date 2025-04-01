using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.Interfaces;
using RentalHouse.SharedLibrary.Responses;
using System.Security.Claims;

namespace RentalHouse.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserRepository _repository;
        public AuthenticationController(IUserRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("register")]
        public async Task<ActionResult<Response>> Register(UserDTO appUserDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _repository.Register(appUserDTO);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _repository.Login(loginDTO);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GetUserDTO>> GetUser(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Không tìm thấy ID của tài khoản!");
            }
            var user = await _repository.GetUser(id);
            return user.Id > 0 ? Ok(user) : BadRequest(user);
        }

        [HttpGet("getCurrentUser")]
        [Authorize]
        public async Task<ActionResult<GetUserDTO>> GetCurrentUser()
        {
            string id = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            if (id == null)
            {
                return BadRequest("Bạn chưa đăng nhập tài khoản!");
            }
            var currentUser = await _repository.GetUser(int.Parse(id));
            return currentUser.Id > 0 ? Ok(currentUser) : BadRequest(currentUser);

        }
    }

    public class PhoneNumberRequest
    {
        public string PhoneNumber { get; set; }
    }

    public class VerifyOtpRequest
    {
        public string SessionInfo { get; set; }
        public string OtpCode { get; set; }
    }
}
