using RentalHouse.Domain.Entities.Addresses.Districts;
using RentalHouse.Domain.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RentalHouse.Domain.Entities.Addresses.Wards
{
    public class Ward : IAddress
    {
        [Key]
        public int Code { get; set; }
        public string Name { get; set; }
        public string DivisionType { get; set; }
        public string CodeName { get; set; }

        [ForeignKey("Code")]
        public int DistrictCode { get; set; }
        [JsonIgnore]
        public District? District { get; set; }
    }
}
