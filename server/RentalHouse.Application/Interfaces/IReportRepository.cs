using RentalHouse.Application.DTOs;
using RentalHouse.Domain.Entities.Reports;
using RentalHouse.SharedLibrary.Responses;

namespace RentalHouse.Application.Interfaces
{
    public interface IReportRepository
    {
        Task<IEnumerable<ReportDto>> GetAllReportsAsync();
        Task<Report> GetReportByIdAsync(int id);
        Task<Response> CreateReportAsync(CreateReportDto reportDto, List<string> imageUrls);
        Task<bool> UpdateReportStatusAsync(int id, UpdateReportDto updateDto);
        Task<PagedResultDTO<ReportDto>> SearchReportsAsync(SearchReportDTO searchParams);
    }
}
