using Microsoft.EntityFrameworkCore;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.Interfaces;
using RentalHouse.Domain.Entities.Addresses.Districts;
using RentalHouse.Domain.Entities.Addresses.Provinces;
using RentalHouse.Domain.Entities.Addresses.Wards;
using RentalHouse.Infrastructure.Data;
using RentalHouse.SharedLibrary.Logs;

namespace RentalHouse.Infrastructure.Repositories
{
    public class AddressRepository : IAddressRepository
    {
        private readonly IRentalHouseDbContext _context;
        public AddressRepository(IRentalHouseDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<AddressDTO>> GetAddressesBySearch(string search)
        {
            try
            {
                var districts = await _context.NhaTros
                    .AsNoTracking()
                    .Where(d => d.Address.ToLower().Contains(search.ToLower()))
                    .Select(d => new AddressDTO(d.Id, d.Address))
                    .ToListAsync();

                return districts is not null ? districts : null!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu!");
            }
        }

        public async Task<IEnumerable<District>> GetAllDistricts()
        {
            try
            {
                var districts = await _context.Districts
                    .AsNoTracking()
                    .Include(d => d.Province)
                    .Include(d => d.Wards)
                    .Take(5)
                    .ToListAsync();
                return districts is not null ? districts : null!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);

                throw new InvalidOperationException("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu!");
            }
        }

        public async Task<IEnumerable<Province>> GetAllProvinces()
        {
            try
            {
                var provinces = await _context.Provinces.AsNoTracking().ToListAsync();
                return provinces is not null ? provinces : null!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);

                throw new InvalidOperationException("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu!");
            }
        }

        public async Task<IEnumerable<Ward>> GetAllWards()
        {
            try
            {
                var wards = await _context.Wards.AsNoTracking().ToListAsync();
                return wards is not null ? wards : null!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);

                throw new InvalidOperationException("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu!");
            }
        }
    }
}
