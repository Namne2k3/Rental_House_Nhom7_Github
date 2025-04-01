using RentalHouse.Domain.Entities;

namespace RentalHouse.Application.DTOs
{
    public record NhaTroDTO(
        int Id,
        string Title,
        string Address,
        string? Description,
        string? DescriptionHtml,
        string? Url,
        int? Price,
        string? PriceExt,
        int? Area,
        int? BedRoom,
        DateTime? PostedDate,
        DateTime? ExpiredDate,
        string? Type,
        string? Code,
        int? BedRoomCount,
        int? BathRoom,
        string? Furniture,
        float? Latitude,
        float? Longitude,
        float? PriceBil,
        float? PriceMil,
        float? PriceVnd,
        float? AreaM2,
        float? PricePerM2,
        List<string> ImageUrls,
        int UserId,
        string fullName,
        string phoneNumber,
        string email,
        ApprovalStatus status,
        bool isActive
    );
}
