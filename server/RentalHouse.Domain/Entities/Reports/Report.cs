using RentalHouse.Domain.Entities.Auth;
using RentalHouse.Domain.Entities.NhaTros;

namespace RentalHouse.Domain.Entities.Reports
{
    public class Report
    {
        public int Id { get; set; }
        public User? User { get; set; }
        public int UserId { get; set; }
        public NhaTro? NhaTro { get; set; }
        public int? NhaTroId { get; set; }
        public string? ReportType { get; set; }
        public string? Description { get; set; }
        public List<ReportImage> Images { get; set; } = new();
        public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
