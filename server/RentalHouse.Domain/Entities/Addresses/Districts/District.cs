using RentalHouse.Domain.Entities.Addresses.Provinces;
using RentalHouse.Domain.Entities.Addresses.Wards;
using RentalHouse.Domain.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RentalHouse.Domain.Entities.Addresses.Districts
{
    public class District : IAddress
    {
        [Key]
        public int Code { get; set; }
        public string Name { get; set; }
        public string DivisionType { get; set; }
        public string CodeName { get; set; }

        [ForeignKey("Code")]
        public int ProvinceCode { get; set; }
        [JsonIgnore]
        public Province? Province { get; set; }

        public List<Ward> Wards { get; set; } = new();

    }
}
