namespace RentalHouse.Application.DTOs
{
    // SearchUsersDTO.cs
    public class SearchUsersDTO
    {
        public string SearchField { get; set; }
        public string SearchValue { get; set; }
        public string? Role { get; set; }
        public bool? IsLock { get; set; }
    }
}
