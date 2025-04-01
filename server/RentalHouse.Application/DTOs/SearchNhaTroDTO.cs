namespace RentalHouse.Application.DTOs
{
    public class SearchNhaTroDTO
    {
        public string? Title { get; set; }
        public int? Status { get; set; }
        public bool? IsActive { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public decimal? MinArea { get; set; }
        public decimal? MaxArea { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
