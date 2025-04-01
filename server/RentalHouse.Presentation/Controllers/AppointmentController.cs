using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.Interfaces;
using RentalHouse.Domain.Entities.Appointments;
using RentalHouse.SharedLibrary.Responses;

namespace RentalHouse.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentController(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
            if (appointment == null)
                return NotFound();

            return Ok(appointment);
        }

        [HttpGet("User/{userId:int}")]
        public async Task<IActionResult> GetAppointmentsByUserId(int userId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByUserIdAsync(userId);
            if (appointments == null || !appointments.Any())
            {
                return NotFound(new { message = "Không tìm thấy lịch hẹn nào." });
            }

            return Ok(appointments);
        }

        [HttpPost]
        public async Task<ActionResult<Response>> CreateAppointment([FromBody] CreateAppointmentDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var appointment = new Appointment
            {
                UserId = dto.UserId,
                NhaTroId = dto.NhaTroId,
                OwnerId = dto.OwnerId,
                AppointmentTime = dto.AppointmentTime,
                Status = "Pending", // Mặc định là "Chờ duyệt"
                CreatedAt = DateTime.UtcNow
            };

            var createdAppointment = await _appointmentRepository.CreateAppointmentAsync(appointment);
            return createdAppointment.Id > 0 ? Ok(new Response(true, "Đặt lịch hẹn xem nhà trọ thành công!")) : BadRequest(new Response(false, "Không thể tạo lịch hẹn!"));
        }

        [HttpGet("Owner/{ownerId:int}")]
        public async Task<IActionResult> GetOwnerAppointments(int ownerId, string? status)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByOwner(ownerId, status);
            return Ok(appointments);
        }


        // 5️⃣ API: Hủy lịch hẹn
        [HttpPost("Delete/{id:int}")]
        public async Task<IActionResult> CancelAppointment(int id, [FromBody] CancelAppointmentDTO dto)
        {
            var cancelled = await _appointmentRepository.CancelAppointmentAsync(id, dto.Reason, dto.ChangedById);
            if (!cancelled)
                return BadRequest(new { message = "Không thể hủy lịch hẹn" });

            return NoContent();
        }

        [HttpGet("{appointmentId}/history")]
        public async Task<IActionResult> GetAppointmentHistory(int appointmentId)
        {
            var history = await _appointmentRepository.GetHistoryByAppointmentIdAsync(appointmentId);

            if (history == null || !history.Any())
                return NotFound(new { message = "Không tìm thấy lịch sử cập nhật." });

            return Ok(history);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
            return Ok(appointments);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateAppointmentDTO dto)
        {
            var updated = await _appointmentRepository.UpdateAppointmentStatusAsync(id, dto.Status, dto.Notes, dto.ChangedById);
            if (!updated)
                return BadRequest(new { message = "Không thể cập nhật trạng thái lịch hẹn" });

            return NoContent();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchAppointments(
            [FromQuery] int? ownerId,
            [FromQuery] int? userId,
            [FromQuery] string? searchField,
            [FromQuery] string? searchValue,
            [FromQuery] string? status,
            [FromQuery] string searchType)
        {
            var appointments = await _appointmentRepository.SearchAppointments(
                ownerId, userId, searchField, searchValue, status, searchType);
            return Ok(appointments);
        }
    }
}
