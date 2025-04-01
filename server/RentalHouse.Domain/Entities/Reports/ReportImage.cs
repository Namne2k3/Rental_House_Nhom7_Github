using System.Text.Json.Serialization;

namespace RentalHouse.Domain.Entities.Reports
{
    public class ReportImage
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        [JsonIgnore]
        public Report? Report { get; set; }
        public string ImageUrl { get; set; } // Đường dẫn ảnh
    }
}
