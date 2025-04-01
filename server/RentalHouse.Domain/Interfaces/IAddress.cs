namespace RentalHouse.Domain.Interfaces
{
    public interface IAddress
    {
        public int Code { get; set; }
        public string Name { get; set; }
        public string DivisionType { get; set; }

        public string CodeName { get; set; }
    }
}
