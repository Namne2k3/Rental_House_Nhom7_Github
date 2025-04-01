using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.Interfaces;
using RentalHouse.SharedLibrary.Responses;
using System.Security.Claims;

namespace RentalHouse.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _reportRepository;
        private readonly IConfiguration _configuration;
        public ReportController(IReportRepository repository, IConfiguration configuration)
        {
            _reportRepository = repository;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseWithDataList>> GetAllReports()
        {
            var reports = await _reportRepository.GetAllReportsAsync();
            return reports.Any() ? Ok(new ResponseWithDataList { Data = reports, IsSuccess = true, Message = "Danh sách khiếu nại" }) : NotFound(new ResponseWithDataList { Message = "Không có dữ liệu khiếu nại" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReportById(int id)
        {
            var report = await _reportRepository.GetReportByIdAsync(id);
            if (report == null)
            {
                return NotFound(new { message = "Không tìm thấy khiếu nại" });
            }
            return Ok(report);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReport([FromForm] CreateReportDto reportDto, [FromForm] List<IFormFile> evidenceFiles)
        {
            if (reportDto == null)
            {
                return BadRequest("Dữ liệu không hợp lệ");
            }
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            reportDto.UserId = int.Parse(userId);
            // Xử lý upload file

            var imageUrls = await UploadImages(evidenceFiles);
            if (!imageUrls.Any())
            {
                return BadRequest(new Response { IsSuccess = false, Message = "Lỗi khi tải ảnh lên" });
            }

            var response = await _reportRepository.CreateReportAsync(reportDto, imageUrls);
            return response is not null ? Ok(new Response(true, "Đã tạo khiếu nại thành công")) : BadRequest(new Response(false, "Không thể tạo khiếu nại"));
        }

        private async Task<List<string>> UploadImages(List<IFormFile> files)
        {
            var imageUrls = new List<string>();
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            // Get server URL from configuration
            var serverUrl = _configuration["ServerUrl"];

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

                    if (!allowedExtensions.Contains(extension))
                    {
                        continue;
                    }

                    var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                        // Store full URL in database
                        imageUrls.Add($"{serverUrl}/uploads/{uniqueFileName}");
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
            }

            return imageUrls;
        }

        [HttpPut("UpdateStatus/{id:int}")]
        public async Task<IActionResult> UpdateReportStatus(int id, [FromBody] UpdateReportDto updateDto)
        {
            var success = await _reportRepository.UpdateReportStatusAsync(id, updateDto);
            if (!success)
            {
                return NotFound(new { message = "Không tìm thấy khiếu nại" });
            }
            return Ok(new { message = "Cập nhật trạng thái thành công!" });
        }

        [HttpGet("search")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResultDTO<ReportDto>>> SearchReports(
            [FromQuery] int? reportId,
            [FromQuery] string? reportType,
            [FromQuery] int? status,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var searchParams = new SearchReportDTO
                {
                    ReportId = reportId,
                    ReportType = reportType,
                    Status = status,
                    StartDate = startDate,
                    EndDate = endDate,
                    Page = page,
                    PageSize = pageSize
                };

                var result = await _reportRepository.SearchReportsAsync(searchParams);

                if (!result.Data.Any())
                {
                    return NotFound(new { message = "Không tìm thấy báo cáo nào phù hợp với điều kiện tìm kiếm." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Có lỗi xảy ra khi tìm kiếm: " + ex.Message });
            }
        }
    }

}
