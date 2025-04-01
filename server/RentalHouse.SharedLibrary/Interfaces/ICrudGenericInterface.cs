using RentalHouse.SharedLibrary.Responses;
using System.Linq.Expressions;

namespace RentalHouse.SharedLibrary.Interfaces
{
    public interface ICrudGenericInterface<T> where T : class
    {
        Task<Response> CreateAsync(T entity);
        Task<Response> DeleteAsync(T entity);
        Task<T> FindByIdAsync(int id);
        Task<T> GetByAsync(Expression<Func<T, bool>> predicate);
    }
}
