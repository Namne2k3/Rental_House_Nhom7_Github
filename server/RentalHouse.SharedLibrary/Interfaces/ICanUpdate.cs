using RentalHouse.SharedLibrary.Responses;

namespace RentalHouse.SharedLibrary.Interfaces
{
    public interface ICanUpdate<T> where T : class
    {
        Task<Response> UpdateAsync(T entity);
    }
}
