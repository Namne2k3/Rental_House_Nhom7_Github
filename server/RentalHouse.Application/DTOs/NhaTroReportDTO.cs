using RentalHouse.Domain.Entities;

namespace RentalHouse.Application.DTOs
{
    public class NhaTroReportDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Address { get; set; } = null!;
        public int? Price { get; set; }
        public int? Area { get; set; }
        public ApprovalStatus Status { get; set; }
        public bool IsActive { get; set; }
        public UserDtoClass Owner { get; set; } = null!;
    }
}
