namespace RentalHouse.Application.DTOs
{
    public class AppointmentHistoryDto
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDtoClass? ChangedBy { get; set; }
    }
}
