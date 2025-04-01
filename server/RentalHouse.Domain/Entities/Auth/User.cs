
using RentalHouse.Domain.Entities.Appointments;
using RentalHouse.Domain.Entities.Favorites;
using RentalHouse.Domain.Entities.NhaTros;
using RentalHouse.Domain.Enums;

namespace RentalHouse.Domain.Entities.Auth
{
    public class User
    {
        public int Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = Roles.User.ToString(); // Admin, User
        public DateTime DateRegistered { get; set; } = DateTime.UtcNow;
        public bool IsLock { get; set; } = false;
        public List<NhaTro> Nhatros { get; set; } = new();
        public List<Favorite> Favorites { get; set; } = new();
        public List<Appointment> Appointments { get; set; } = new();
    }
}
