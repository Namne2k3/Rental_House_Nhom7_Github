using Microsoft.EntityFrameworkCore;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.Interfaces;
using RentalHouse.Domain.Entities.Favorites;
using RentalHouse.Domain.Entities.NhaTros;
using RentalHouse.Infrastructure.Data;
using RentalHouse.SharedLibrary.Interfaces;
using RentalHouse.SharedLibrary.Logs;
using RentalHouse.SharedLibrary.Responses;
using System.Linq.Expressions;

namespace RentalHouse.Infrastructure.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly IRentalHouseDbContext _context;
        public FavoriteRepository(IRentalHouseDbContext context)
        {
            _context = context;
        }
        public async Task<FavoriteResponse> CreateAsync(Favorite entity)
        {
            try
            {
                // Kiểm tra xem người dùng có tồn tại hay không
                var userExists = await _context.Users.AnyAsync(u => u.Id == entity.UserId);
                if (!userExists)
                {
                    return new FavoriteResponse(0, false, "Người dùng không tồn tại!");
                }

                var fav = await GetByAsync(f => f.UserId == entity.UserId && f.NhaTroId == entity.NhaTroId);
                if (fav is not null)
                {
                    return new FavoriteResponse(0, false, "Bạn đã lưu thông tin nhà trọ này trước đó!");
                }

                // Thêm thực thể mới vào cơ sở dữ liệu
                var currentFav = _context.Favorites.Add(entity).Entity;
                await _context.SaveChangesAsync();

                // Truy vấn lại thực thể vừa được thêm vào với Select
                var addedFav = await _context.Favorites
                    .Where(f => f.Id == currentFav.Id)
                    .Select(f => new Favorite
                    {
                        Id = f.Id,
                        UserId = f.UserId,
                        NhaTroId = f.NhaTroId,
                        DateSaved = f.DateSaved,
                        NhaTro = new NhaTro
                        {
                            Id = f.NhaTro.Id,
                            Title = f.NhaTro.Title,
                            Address = f.NhaTro.Address,
                            Images = f.NhaTro.Images.Select(i => new NhaTroImage
                            {
                                ID = i.ID,
                                ImageUrl = i.ImageUrl
                            }).ToList()
                        }
                    })
                    .FirstOrDefaultAsync();

                if (addedFav is not null)
                {
                    return new FavoriteResponse(addedFav.Id, true, "Đã lưu thông tin nhà trọ!", addedFav);
                }
                else
                {
                    return new FavoriteResponse(0, false, "Có lỗi xảy ra khi thêm thông tin nhà trọ!");
                }
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Có lỗi xảy ra khi thêm thông tin nhà trọ!", ex);
            }
        }

        public async Task<Response> DeleteAsync(Favorite entity)
        {
            try
            {
                var userExists = await _context.Users.AnyAsync(u => u.Id == entity.UserId);
                if (!userExists)
                {
                    return new Response(false, "Người dùng không tồn tại!");
                }


                var fav = await _context.Favorites.FirstOrDefaultAsync(p => p.Id == entity.Id);
                if (fav is null)
                {
                    return new Response(false, $"Không tìm thấy thông tin nhà trọ đã lưu!");
                }
                _context.Entry(fav).State = EntityState.Detached;
                _context.Favorites.Remove(fav);
                await _context.SaveChangesAsync();
                return new Response(true, $"Đã bỏ lưu thông tin nhà trọ!");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Có lỗi xảy ra khi bỏ lưu thông tin nhà trọ!");
            }
        }

        public async Task<Favorite> FindByIdAsync(int id)
        {
            try
            {
                var getFav = await _context.Favorites
                    .Include(f => f.NhaTro)
                    .Include(f => f.User)
                    .Where(f => f.Id == id)
                    .FirstOrDefaultAsync()!;

                return getFav is not null ? getFav : null!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Có lỗi xảy ra khi tìm kiếm thông tin nhà trọ!");
            }
        }
        public async Task<IEnumerable<Favorite>> GetFavoritesByUserIdAsync(int userId)
        {
            try
            {
                var favs = await _context.Favorites
                    .AsNoTracking()
                    .Where(f => f.UserId == userId)
                    .OrderByDescending(f => f.DateSaved)
                    .Select(f => new Favorite
                    {
                        Id = f.Id,
                        UserId = f.UserId,
                        NhaTroId = f.NhaTroId,
                        DateSaved = f.DateSaved,
                        NhaTro = new NhaTro
                        {
                            Id = f.NhaTro.Id,
                            Title = f.NhaTro.Title,
                            Address = f.NhaTro.Address,
                            Images = f.NhaTro.Images.Select(i => new NhaTroImage
                            {
                                ID = i.ID,
                                ImageUrl = i.ImageUrl
                            }).ToList()
                        }
                    })
                    .ToListAsync();

                return favs ?? new List<Favorite>();
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Có lỗi xảy ra khi truy xuất thông tin nhà trọ đã lưu!", ex);
            }
        }

        public async Task<Favorite> GetByAsync(Expression<Func<Favorite, bool>> predicate)
        {
            try
            {
                var fav = await _context.Favorites
                    .Include(f => f.NhaTro)
                    .Include(f => f.User)
                    .Where(predicate)
                    .FirstOrDefaultAsync()!;

                return fav is not null ? fav : null!;

            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);

                throw new InvalidOperationException("Xảy ra lỗi khi truy xuất thông tin nhà trọ!");
            }
        }

        Task<Response> ICrudGenericInterface<Favorite>.CreateAsync(Favorite entity)
        {
            throw new NotImplementedException();
        }
    }
}
