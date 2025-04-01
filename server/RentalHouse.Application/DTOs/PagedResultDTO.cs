namespace RentalHouse.Application.DTOs
{
    public record PagedResultDTO<T>(int TotalItems, int TotalPages, IEnumerable<T>? Data);
}
