using RentalHouse.Application.DTOs;
using RentalHouse.Domain.Entities.Favorites;
using RentalHouse.SharedLibrary.Interfaces;

namespace RentalHouse.Application.Interfaces
{
    public interface IFavoriteRepository : ICrudGenericInterface<Favorite>
    {
        new Task<FavoriteResponse> CreateAsync(Favorite entity);
        Task<IEnumerable<Favorite>> GetFavoritesByUserIdAsync(int userId);
    }
}
