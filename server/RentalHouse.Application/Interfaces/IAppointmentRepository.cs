using RentalHouse.Application.DTOs;
using RentalHouse.Domain.Entities.Appointments;

namespace RentalHouse.Application.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<Appointment> CreateAppointmentAsync(Appointment appointment);
        Task<Appointment?> GetAppointmentByIdAsync(int id);
        Task<IEnumerable<Appointment>> GetAllAppointmentsAsync();
        Task<bool> UpdateAppointmentStatusAsync(int id, string status, string? notes, int changedById);
        Task<bool> CancelAppointmentAsync(int id, string reason, int changedById);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsByUserIdAsync(int userId);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsByOwner(int userId, string? status);
        Task<List<AppointmentHistoryDto>> GetHistoryByAppointmentIdAsync(int appointmentId);
        Task<IEnumerable<AppointmentDto>> SearchAppointments(
            int? ownerId,
            int? userId,
            string? searchField,
            string? searchValue,
            string? status,
            string searchType
        );
    }
}
