using Microsoft.EntityFrameworkCore;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.Interfaces;
using RentalHouse.Domain.Entities.Appointments;
using RentalHouse.Infrastructure.Data;

namespace RentalHouse.Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly IRentalHouseDbContext _context;
        public AppointmentRepository(IRentalHouseDbContext context)
        {
            _context = context;
        }
        public async Task<List<AppointmentHistoryDto>> GetHistoryByAppointmentIdAsync(int appointmentId)
        {
            var histories = await _context.AppointmentHistories
                .Where(h => h.AppointmentId == appointmentId)
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new AppointmentHistoryDto
                {
                    Id = h.Id,
                    AppointmentId = h.AppointmentId,
                    Status = h.Status,
                    Notes = h.Notes,
                    CreatedAt = h.CreatedAt,
                    ChangedBy = new UserDtoClass
                    {
                        Id = h.ChangedBy!.Id,
                        FullName = h.ChangedBy.FullName, // Chỉ lấy thông tin cần thiết
                        Email = h.ChangedBy.Email,
                        PhoneNumber = h.ChangedBy.PhoneNumber!
                    }
                })
                .ToListAsync();

            return histories;
        }
        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByUserIdAsync(int userId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.UserId == userId)
                .Include(a => a.NhaTro)
                .Include(a => a.Owner)
                .Include(a => a.User)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    OwnerId = a.OwnerId,
                    OwnerName = a.Owner.FullName, // Lấy tên chủ trọ
                    OwnerEmail = a.Owner.Email,
                    OwnerPhoneNumber = a.Owner.PhoneNumber,
                    CustomerEmail = a.User.Email,
                    CustomerId = a.User.Id,
                    CustomerName = a.User.FullName,
                    CustomerPhoneNumber = a.User.PhoneNumber,
                    NhaTroId = a.NhaTroId,
                    Address = a.NhaTro.Address,
                    AppointmentTime = a.AppointmentTime,
                    Notes = a.Notes,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return appointments;
        }
        public async Task<bool> CancelAppointmentAsync(int id, string reason, int changedById)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;

            appointment.Status = "Cancelled";
            appointment.UpdatedAt = DateTime.UtcNow;

            // Lưu lịch sử hủy
            var history = new AppointmentHistory
            {
                AppointmentId = id,
                Status = "Cancelled",
                Notes = reason,
                ChangedById = changedById,
                CreatedAt = DateTime.UtcNow
            };

            _context.AppointmentHistories.Add(history);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
        {
            try
            {
                var createdAppointment = _context.Appointments.Add(appointment).Entity;
                await _context.SaveChangesAsync();
                return createdAppointment;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            var appointmentList = await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.NhaTro)
                .Include(a => a.Owner)
                .ToListAsync();

            return appointmentList;
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.NhaTro)
                .Include(a => a.Owner)
                .FirstOrDefaultAsync(a => a.Id == id);

            return appointment;
        }

        public async Task<bool> UpdateAppointmentStatusAsync(int id, string status, string? notes, int changedById)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;

            appointment.Status = status;
            appointment.UpdatedAt = DateTime.UtcNow;

            // Lưu lịch sử thay đổi trạng thái
            var history = new AppointmentHistory
            {
                AppointmentId = id,
                Status = status,
                Notes = notes,
                ChangedById = changedById,
                CreatedAt = DateTime.UtcNow
            };

            _context.AppointmentHistories.Add(history);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByOwner(int userId, string status)
        {
            var appointments = await _context.Appointments
                .Where(a => a.OwnerId == userId && (status == null || a.Status == status))
                .Include(a => a.NhaTro)
                .Include(a => a.Owner) // Thêm Include Owner để lấy thông tin chủ trọ
                .Include(a => a.User)  // Chỉ cần Include User một lần
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    OwnerId = a.OwnerId,
                    OwnerName = a.Owner.FullName,
                    OwnerEmail = a.Owner.Email,
                    OwnerPhoneNumber = a.Owner.PhoneNumber,
                    CustomerEmail = a.User.Email,
                    CustomerId = a.User.Id,
                    CustomerName = a.User.FullName,
                    CustomerPhoneNumber = a.User.PhoneNumber,
                    NhaTroId = a.NhaTroId,
                    Address = a.NhaTro.Address,
                    AppointmentTime = a.AppointmentTime,
                    Notes = a.Notes,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return appointments;
        }
        public async Task<IEnumerable<AppointmentDto>> SearchAppointments(
    int? ownerId,
    int? userId,
    string? searchField,
    string? searchValue,
    string? status,
    string searchType)
        {
            var query = _context.Appointments
                .Include(a => a.NhaTro)
                .Include(a => a.Owner)
                .Include(a => a.User)
                .AsQueryable();

            // Lọc theo loại tìm kiếm
            if (searchType == "owner" && ownerId.HasValue)
            {
                query = query.Where(a => a.OwnerId == ownerId);
            }
            else if (searchType == "user" && userId.HasValue)
            {
                query = query.Where(a => a.UserId == userId);
            }

            // Lọc theo trạng thái nếu có
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(a => a.Status == status);
            }

            // Áp dụng tìm kiếm nếu có cả searchField và searchValue
            if (!string.IsNullOrEmpty(searchField) && !string.IsNullOrEmpty(searchValue))
            {
                searchValue = searchValue.ToLower();
                query = searchField switch
                {
                    "id" => query.Where(a => a.Id.ToString().Contains(searchValue)),
                    "customerName" => query.Where(a => a.User.FullName.ToLower().Contains(searchValue)),
                    "customerEmail" => query.Where(a => a.User.Email.ToLower().Contains(searchValue)),
                    "customerPhoneNumber" => query.Where(a => a.User.PhoneNumber.Contains(searchValue)),
                    "ownerName" => query.Where(a => a.Owner.FullName.ToLower().Contains(searchValue)),
                    "ownerEmail" => query.Where(a => a.Owner.Email.ToLower().Contains(searchValue)),
                    "ownerPhoneNumber" => query.Where(a => a.Owner.PhoneNumber.Contains(searchValue)),
                    "address" => query.Where(a => a.NhaTro.Address.ToLower().Contains(searchValue)),
                    _ => query
                };
            }

            var appointments = await query
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    OwnerId = a.OwnerId,
                    OwnerName = a.Owner.FullName,
                    OwnerEmail = a.Owner.Email,
                    OwnerPhoneNumber = a.Owner.PhoneNumber,
                    CustomerEmail = a.User.Email,
                    CustomerId = a.User.Id,
                    CustomerName = a.User.FullName,
                    CustomerPhoneNumber = a.User.PhoneNumber,
                    NhaTroId = a.NhaTroId,
                    Address = a.NhaTro.Address,
                    AppointmentTime = a.AppointmentTime,
                    Notes = a.Notes,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return appointments;
        }
    }
}
