namespace RentalHouse.Application.DTOs
{
    public class SearchReportDTO
    {
        public int? ReportId { get; set; }
        public string? ReportType { get; set; }
        public int? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
