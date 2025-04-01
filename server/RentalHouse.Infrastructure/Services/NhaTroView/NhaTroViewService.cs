using RentalHouse.Application.Interfaces;
using RentalHouse.Infrastructure.Data;
namespace RentalHouse.Infrastructure.Services.NhaTroView
{

    public class NhaTroViewService : INhaTroViewService
    {
        private readonly IRentalHouseDbContext _context;

        public NhaTroViewService(IRentalHouseDbContext context)
        {
            _context = context;
        }

        public async Task IncrementViewAsync(int nhaTroId, string? ipAddress, int? viewerId)
        {
            try
            {
                var nhaTro = await _context.NhaTros.FindAsync(nhaTroId);
                if (nhaTro == null)
                    throw new Exception("Không tìm thấy nhà trọ");

                // Tăng số lượt xem
                nhaTro.ViewCount++;

                // Thêm chi tiết lượt xem
                var view = new Domain.Entities.NhaTros.NhaTroView
                {
                    NhaTroId = nhaTroId,
                    ViewedAt = DateTime.UtcNow,
                    ViewerIp = ipAddress,
                    ViewerId = viewerId
                };

                _context.NhaTroViews.Add(view);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }
        }
    }
}
