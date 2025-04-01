namespace RentalHouse.Application.DTOs
{
    public record LoginResponse(GetUserDTO user, bool IsSuccess, string Message);
}
