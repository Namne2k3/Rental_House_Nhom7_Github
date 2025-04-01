namespace RentalHouse.Application.DTOs
{
    public class ResponseWithDataList
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public IEnumerable<object> Data { get; set; }
    }
}
