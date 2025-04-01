namespace RentalHouse.Application.DTOs
{
    public record UserDTO(
        int Id,
        string FullName,
        string Password,
        string Email,
        string PhoneNumber
    );
}
