using RentalHouse.Domain.Entities.Addresses.Districts;
using RentalHouse.Domain.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace RentalHouse.Domain.Entities.Addresses.Provinces
{
    public class Province : IAddress
    {
        [Key]
        public int Code { get; set; }
        public required string Name { get; set; }
        public required string DivisionType { get; set; }

        public required string CodeName { get; set; }
        public int PhoneCode { get; set; }

        public List<District> Districts { get; set; } = new();
    }
}
