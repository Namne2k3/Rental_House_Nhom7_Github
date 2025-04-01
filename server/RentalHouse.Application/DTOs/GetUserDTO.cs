namespace RentalHouse.Application.DTOs
{
    public record GetUserDTO(
        int Id,
        string FullName,
        string Email,
        string PhoneNumber,
        string? Role,
        bool? IsLock
    );
}
