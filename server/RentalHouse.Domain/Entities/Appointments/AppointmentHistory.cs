using RentalHouse.Domain.Entities.Auth;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentalHouse.Domain.Entities.Appointments
{
    public class AppointmentHistory
    {
        public int Id { get; set; }

        [ForeignKey("Appointment")]
        public int AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; }  // Trạng thái mới: "Approved", "Rejected"

        [MaxLength(500)]
        public string? Notes { get; set; }  // Lý do từ chối (nếu có)

        [ForeignKey("ChangedBy")]
        public int ChangedById { get; set; }  // Ai thực hiện thay đổi
        public User? ChangedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
