namespace RentalHouse.Application.DTOs
{
    public class NhaTroUpdateRequestDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Address { get; set; }
        public string? Description { get; set; }
        public string? DescriptionHtml { get; set; }
        public string? Url { get; set; }
        public int? Price { get; set; }
        public string? PriceExt { get; set; }
        public int? Area { get; set; }
        public int? BedRoom { get; set; }
        public DateTime? PostedDate { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public string? Type { get; set; }
        public string? Code { get; set; }
        public int? BedRoomCount { get; set; }
        public int? BathRoom { get; set; }
        public string? Furniture { get; set; }
        public float? Latitude { get; set; }
        public float? Longitude { get; set; }
        public float? PriceBil { get; set; }
        public float? PriceMil { get; set; }
        public float? PriceVnd { get; set; }
        public float? AreaM2 { get; set; }
        public float? PricePerM2 { get; set; }
        public List<string> ImageUrls { get; set; } = new();
    }
}
