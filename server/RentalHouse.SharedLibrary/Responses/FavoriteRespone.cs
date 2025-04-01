namespace RentalHouse.Application.DTOs
{
    public record FavoriteResponse(int NhaTroId, bool IsSuccess, string Message, object? data = null);
}
