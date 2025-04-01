namespace RentalHouse.SharedLibrary.Interfaces
{
    public interface ICanGetAllWithoutParam<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
    }
}
