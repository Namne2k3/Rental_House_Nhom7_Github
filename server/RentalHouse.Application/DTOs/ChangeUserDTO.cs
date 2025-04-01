namespace RentalHouse.Application.DTOs
{
    public record ChangeUserDTO(
        int Id,
        string FullName,
        string Email,
        string PhoneNumber
    );
}
