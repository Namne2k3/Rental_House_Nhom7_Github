using RentalHouse.Application.DTOs;
using RentalHouse.Domain.Entities.Addresses.Districts;
using RentalHouse.Domain.Entities.Addresses.Provinces;
using RentalHouse.Domain.Entities.Addresses.Wards;

namespace RentalHouse.Application.Interfaces
{
    public interface IAddressRepository
    {
        Task<IEnumerable<Province>> GetAllProvinces();
        Task<IEnumerable<District>> GetAllDistricts();
        Task<IEnumerable<Ward>> GetAllWards();

        Task<IEnumerable<AddressDTO>> GetAddressesBySearch(string search);
    }
}
