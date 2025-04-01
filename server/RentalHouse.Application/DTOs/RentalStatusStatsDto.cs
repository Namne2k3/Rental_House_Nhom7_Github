namespace RentalHouse.Application.DTOs
{
    public class RentalStatusStatsDto
    {
        public int TotalPosts { get; set; }
        public int ActivePosts { get; set; }
        public int ExpiredPosts { get; set; }
        public int PendingPosts { get; set; }
    }
}
