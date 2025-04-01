using Microsoft.AspNetCore.Mvc;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.Interfaces;
using RentalHouse.Domain.Entities.Addresses.Districts;

namespace RentalHouse.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowOrigin")]
    public class AddressController : ControllerBase
    {
        private readonly IAddressRepository _repository;
        public AddressController(IAddressRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDTO>>> GetNhaTroAddresses(string search)
        {
            var addresses = await _repository.GetAddressesBySearch(search);
            if (!addresses.Any())
            {
                return NotFound("Không tìm thấy địa chỉ phù hợp!");
            }

            return addresses is not null ? Ok(addresses) : NotFound("Không tìm thấy địa chỉ phù hợp!");
        }

        [HttpGet("GetAllDistricts")]
        public async Task<ActionResult<IEnumerable<District>>> GetAllDistricts()
        {
            var districts = await _repository.GetAllDistricts();
            if (!districts.Any())
            {
                return NotFound("Không tìm thấy quận/huyện nào!");
            }
            return districts is not null ? Ok(districts) : NotFound("Không tìm thấy quận/huyện nào!");
        }
    }
}
