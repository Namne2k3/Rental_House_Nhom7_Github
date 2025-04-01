using RentalHouse.Domain.Entities.Auth;

namespace RentalHouse.Domain.Entities.NhaTros
{
    public class NhaTroView
    {
        public int Id { get; set; }
        public int NhaTroId { get; set; }
        public NhaTro? NhaTro { get; set; }
        public DateTime ViewedAt { get; set; }
        public string? ViewerIp { get; set; }
        // Có thể thêm UserId nếu muốn theo dõi user đã đăng nhập
        public int? ViewerId { get; set; }
        public User? Viewer { get; set; }
    }
}