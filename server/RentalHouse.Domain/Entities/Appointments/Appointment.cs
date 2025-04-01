using RentalHouse.Domain.Entities.Auth;
using RentalHouse.Domain.Entities.NhaTros;
using System.ComponentModel.DataAnnotations;

namespace RentalHouse.Domain.Entities.Appointments
{
    public class Appointment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int OwnerId { get; set; }
        public User? Owner { get; set; }
        public int NhaTroId { get; set; }
        public NhaTro? NhaTro { get; set; }

        public DateTime AppointmentTime { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public List<AppointmentHistory> AppointmentHistories { get; set; } = new();
    }

}
