using RentalHouse.Domain.Entities;

namespace RentalHouse.Application.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public UserDtoClass? User { get; set; }
        public int? NhaTroId { get; set; }
        public string? ReportType { get; set; }
        public string? Description { get; set; }
        public string OwnerEmail { get; set; }
        public string OwnerPhoneNumber { get; set; }
        public string OnwerFullName { get; set; }
        public List<string> Images { get; set; } = new();
        public ApprovalStatus Status { get; set; }
        public NhaTroReportDTO? NhaTro { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}
