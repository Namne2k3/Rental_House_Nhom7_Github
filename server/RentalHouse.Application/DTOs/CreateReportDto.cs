using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace RentalHouse.Application.DTOs
{
    public class CreateReportDto
    {
        public int UserId { get; set; }

        public int? NhaTroId { get; set; } // Nếu khiếu nại liên quan đến nhà trọ

        [Required]
        public string ReportType { get; set; } // Loại khiếu nại (Nhà trọ, Chủ nhà, Thanh toán)

        [Required]
        public string Description { get; set; }

        public List<IFormFile> EvidenceFiles { get; set; } // Danh sách ảnh tải lên
    }
}
