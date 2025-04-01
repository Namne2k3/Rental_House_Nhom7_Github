using RentalHouse.Domain.Entities.Auth;
using RentalHouse.Domain.Entities.NhaTros;

namespace RentalHouse.Domain.Entities.Favorites
{
    public class Favorite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public int NhaTroId { get; set; }
        public NhaTro? NhaTro { get; set; }
        public DateTime DateSaved { get; set; } = DateTime.UtcNow;
    }
}
