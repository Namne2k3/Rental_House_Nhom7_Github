namespace RentalHouse.Application.DTOs
{
    public class RentalViewStatsDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Address { get; set; }
        public int? Area { get; set; }
        public int? Price { get; set; }
        public int ViewCount { get; set; }
        public DateTime? PostedDate { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public string Status { get; set; }
    }
}
