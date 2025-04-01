namespace RentalHouse.Application.DTOs
{
    public class CreateAppointmentDTO
    {
        public int UserId { get; set; }
        public int NhaTroId { get; set; }
        public int OwnerId { get; set; }
        public string? Notes { get; set; }
        public DateTime AppointmentTime { get; set; }
    }

    public class UpdateAppointmentDTO
    {
        public string Status { get; set; }
        public string? Notes { get; set; }
        public int ChangedById { get; set; }
    }

    public class CancelAppointmentDTO
    {
        public string Reason { get; set; }
        public int ChangedById { get; set; }
    }

    public class AppointmentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int OwnerId { get; set; }
        public string OwnerName { get; set; } // Chủ trọ
        public string OwnerEmail { get; set; }
        public string OwnerPhoneNumber { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } // Chủ trọ
        public string CustomerEmail { get; set; }
        public string CustomerPhoneNumber { get; set; }
        public int NhaTroId { get; set; }
        public string Address { get; set; }
        public DateTime AppointmentTime { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
