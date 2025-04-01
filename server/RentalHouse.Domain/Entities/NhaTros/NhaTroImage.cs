using System.ComponentModel.DataAnnotations;

namespace RentalHouse.Domain.Entities.NhaTros
{
    public class NhaTroImage
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public int NhaTroID { get; set; }
        public NhaTro? NhaTro { get; set; }
    }
}
