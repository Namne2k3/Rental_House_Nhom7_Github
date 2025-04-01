using RentalHouse.Domain.Entities.Auth;
using RentalHouse.Domain.Entities.Favorites;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentalHouse.Domain.Entities.NhaTros
{
    public class NhaTro
    {
        public int Id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(500)")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "nvarchar(255)")]
        public string Address { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(MAX)")]
        public string? Description { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string? DescriptionHtml { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? Url { get; set; }
        public int? Price { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? PriceExt { get; set; }

        public int? Area { get; set; }
        public int? BedRoom { get; set; }

        public DateTime? PostedDate { get; set; }
        public DateTime? ExpiredDate { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? Type { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? Code { get; set; }


        public int? BedRoomCount { get; set; }
        public int? BathRoom { get; set; }


        [Column(TypeName = "nvarchar(255)")]
        public string? Furniture { get; set; }

        public float? Latitude { get; set; }
        public float? Longitude { get; set; }

        public float? PriceBil { get; set; }
        public float? PriceMil { get; set; }
        public float? PriceVnd { get; set; }
        public float? AreaM2 { get; set; }
        public float? PricePerM2 { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }
        public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;
        public string? RejectionReason { get; set; }
        public DateTime? ApprovedDate { get; set; }

        public List<NhaTroImage> Images { get; set; } = new();
        public List<Favorite> Favorites { get; set; } = new();
        public int ViewCount { get; set; } = 0;

        // Thêm trường thời gian cập nhật cuối
        public DateTime? LastUpdatedDate { get; set; }

        // Thêm trường trạng thái hoạt động
        public bool IsActive { get; set; } = true;

        // Thêm trường theo dõi lịch sử xem
        public List<NhaTroView> Views { get; set; } = new();
    }
}
