using Microsoft.EntityFrameworkCore;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.DTOs.Conversions;
using RentalHouse.Application.Interfaces;
using RentalHouse.Domain.Entities;
using RentalHouse.Domain.Entities.NhaTros;
using RentalHouse.Infrastructure.Data;
using RentalHouse.SharedLibrary.Logs;
using RentalHouse.SharedLibrary.Responses;
using System.Linq.Expressions;

namespace RentalHouse.Infrastructure.Repositories
{
    public class NhaTroRepository : INhaTroRepository
    {
        private readonly IRentalHouseDbContext _context;
        public NhaTroRepository(IRentalHouseDbContext context)
        {
            _context = context;
        }

        public async Task<Response> CreateAsync(NhaTro entity, List<string> images)
        {
            try
            {
                var nhatro = await GetByAsync(n => n.Address.Equals(entity.Address));
                if (nhatro is not null)
                {
                    return new Response(false, "Dữ liệu nhà trọ này đã tồn tại!");
                }

                var currentNhaTro = _context.NhaTros.Add(entity).Entity;
                await _context.SaveChangesAsync();

                foreach (var imageUrl in images)
                {
                    var nhaTroImage = new NhaTroImage
                    {
                        ImageUrl = imageUrl,
                        NhaTroID = currentNhaTro.Id
                    };
                    _context.NhaTroImages.Add(nhaTroImage);
                }
                await _context.SaveChangesAsync();

                if (currentNhaTro is not null && currentNhaTro.Id > 0)
                {
                    return new Response(true, "Dữ liệu nhà trọ đã được thêm vào!");
                }
                else
                {
                    return new Response(false, $"Có lỗi xảy ra khi thêm {entity.Title}!");
                }
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);

                return new Response(false, "Có lỗi xảy ra khi thêm dữ liệu!");
            }
        }

        public Task<Response> CreateAsync(NhaTro entity)
        {
            throw new NotImplementedException();
        }

        public async Task<Response> DeleteAsync(NhaTro entity)
        {
            try
            {
                var nhatro = await FindByIdAsync(entity.Id);
                if (nhatro is null)
                {
                    return new Response(false, $"Không tìm thấy dữ liệu: {entity.Title}!");
                }
                _context.Entry(nhatro).State = EntityState.Detached;
                _context.NhaTros.Remove(entity);
                await _context.SaveChangesAsync();
                return new Response(true, $"{entity.Title} đã xóa thành công!");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new Response(false, "Có lỗi xảy ra khi xóa dữ liệu!");
            }
        }

        public async Task<NhaTro> FindByIdAsync(int id)
        {
            try
            {
                var product = await _context.NhaTros
                    .Include(n => n.Images)
                    .Include(n => n.User)
                    .FirstOrDefaultAsync(n => n.Id == id && n.Status == ApprovalStatus.Approved && n.IsActive == true);
                return product is not null ? product : null!;

            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);

                throw new Exception("Có lỗi xảy ra khi tìm kiếm dữ liệu!");
            }
        }

        public async Task<IEnumerable<NhaTro>> GetAllAsync()
        {
            try
            {
                var nhatros = await _context.NhaTros
                    .AsNoTracking()
                    .Take(20)
                    .Include(n => n.Images)
                    .Where(n => n.Status != 0)
                    .ToListAsync();
                return nhatros is not null ? nhatros : null!;

            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);

                throw new InvalidOperationException("Xảy ra lỗi khi truy xuất dữ liệu!");
            }
        }
        public async Task<PagedResultDTO<NhaTroDTO>> GetAllAsyncWithFilters(
            int page = 1,
            int pageSize = 20,
            string? city = null,
            string? district = null,
            string? commune = null,
            string? street = null,
            string? address = null,
            decimal? price1 = null,
            decimal? price2 = null,
            decimal? area1 = null,
            decimal? area2 = null,
            int? bedRoomCount = null,
            int? userId = null
        )
        {
            try
            {
                // Query server-side: chỉ những điều kiện mà EF có thể dịch sang SQL
                var query = _context.NhaTros
                    .AsNoTracking()
                    .Include(n => n.Images)
                    .Include(u => u.User)
                    .Where(n =>
                        (address != null &&
                            (n.Address != null && n.Address.ToLower().Contains(address.ToLower())) &&
                            (n.Status == ApprovalStatus.Approved) &&
                            (userId == null || (n.UserId == userId) &&
                            (n.IsActive == true)
                            )
                        )
                        ||
                        (address == null &&
                            (userId == null || (n.UserId == userId)) &&
                            (city == null || (n.Address != null && n.Address.ToLower().Contains(city.ToLower()))) &&
                            (district == null || (n.Address != null && n.Address.ToLower().Contains(district.ToLower()))) &&
                            (commune == null || (n.Address != null && n.Address.ToLower().Contains(commune.ToLower()))) &&
                            (street == null || (n.Address != null && n.Address.ToLower().Contains(street.ToLower()))) &&
                            (n.Status == ApprovalStatus.Approved)
                        )
                    );

                // Apply additional filters directly in the query
                if (price1 != null && price2 != null)
                {
                    query = query.Where(n => n.Price >= price1 && n.Price <= price2);
                }

                if (area1 != null && area2 != null)
                {
                    query = query.Where(n => n.Area != null && n.Area >= area1.Value && n.Area <= area2.Value);
                }

                if (bedRoomCount != null)
                {
                    query = query.Where(n => n.BedRoomCount != null && n.BedRoomCount == bedRoomCount.Value);
                }

                // Tính tổng số mục dựa trên dữ liệu đã được filter
                var totalItems = await query.CountAsync();

                // Sắp xếp và phân trang trên tập dữ liệu đã filter
                var pagedData = await query
                    .OrderByDescending(n => n.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var (_, list) = NhaTroConversion.FromEntity(null, pagedData);

                return new PagedResultDTO<NhaTroDTO>(
                    TotalItems: totalItems,
                    TotalPages: (int)Math.Ceiling((double)totalItems / pageSize),
                    Data: list ?? new List<NhaTroDTO>()
                );
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Xảy ra lỗi khi truy xuất dữ liệu!", ex);
            }
        }

        public async Task<PagedResultDTO<NhaTroDTO>> GetAllNhaTros(int page = 1, int pageSize = 20)
        {
            try
            {
                // Query server-side: chỉ những điều kiện mà EF có thể dịch sang SQL
                var query = _context.NhaTros
                    .AsNoTracking()
                    .Include(n => n.Images)
                    .Include(u => u.User);

                // Sắp xếp và phân trang trên tập dữ liệu đã filter
                var totalItems = await query.CountAsync();

                var pagedData = await query
                    .OrderByDescending(n => n.PostedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var (_, list) = NhaTroConversion.FromEntity(null, pagedData);

                return new PagedResultDTO<NhaTroDTO>(
                    TotalItems: totalItems,
                    TotalPages: (int)Math.Ceiling((double)totalItems / pageSize),
                    Data: list ?? new List<NhaTroDTO>()
                );
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Xảy ra lỗi khi truy xuất dữ liệu!", ex);
            }
        }

        public async Task<PagedResultDTO<NhaTroDTO>> GetAllNhaTrosByUserId(int id, int page = 1, int pageSize = 20)
        {
            try
            {
                // Query server-side: chỉ những điều kiện mà EF có thể dịch sang SQL
                var query = _context.NhaTros
                    .AsNoTracking()
                    .Include(n => n.Images)
                    .Include(u => u.User)
                    .Where(n => n.UserId == id);

                // Sắp xếp và phân trang trên tập dữ liệu đã filter
                var totalItems = await query.CountAsync();

                var pagedData = await query
                    .OrderByDescending(n => n.PostedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var (_, list) = NhaTroConversion.FromEntity(null, pagedData);

                return new PagedResultDTO<NhaTroDTO>(
                    TotalItems: totalItems,
                    TotalPages: (int)Math.Ceiling((double)totalItems / pageSize),
                    Data: list ?? new List<NhaTroDTO>()
                );
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Xảy ra lỗi khi truy xuất dữ liệu!", ex);
            }
        }

        public async Task<NhaTro> GetByAsync(Expression<Func<NhaTro, bool>> predicate)
        {
            try
            {

                var nhatro = await _context.NhaTros.Where(predicate).FirstOrDefaultAsync()!;
                return nhatro is not null ? nhatro : null!;

            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);

                throw new InvalidOperationException("Xảy ra lỗi khi truy xuất dữ liệu!");
            }
        }

        public async Task<IEnumerable<NhaTroDTO>> GetRelateNhaTrosAsync(int nhaTroId, int count)
        {
            try
            {
                var currentNhaTro = await _context.NhaTros.AsNoTracking().FirstOrDefaultAsync(n => n.Id == nhaTroId);

                if (currentNhaTro == null)
                {
                    return Enumerable.Empty<NhaTroDTO>();
                }

                var relatedNhaTros = await _context.NhaTros.AsNoTracking()
                    .Include(n => n.User)
                    .Include(n => n.Images)
                    .Where(n => n.Id != nhaTroId && n.Price >= currentNhaTro.Price * 0.8m && n.Price <= currentNhaTro.Price * 1.2m && n.Status != 0)
                    .Take(count)
                    .ToListAsync();

                var (_, listNhaTroDTOS) = NhaTroConversion.FromEntity(null, relatedNhaTros);

                return listNhaTroDTOS != null ? listNhaTroDTOS : Enumerable.Empty<NhaTroDTO>();


            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Xảy ra lỗi khi tìm dữ liệu nhà trọ liên quan!");
            }
        }

        public async Task<IEnumerable<RentalViewStatsDto>> GetViewStatsAsync(int userId)
        {
            var now = DateTime.UtcNow.Date;
            return await _context.NhaTros
                .Where(n => n.UserId == userId)
                .Select(n => new RentalViewStatsDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Address = n.Address,
                    Price = n.Price,
                    Area = n.Area,
                    ViewCount = n.ViewCount,
                    PostedDate = n.PostedDate,
                    ExpiredDate = n.ExpiredDate,
                    Status = n.Status.ToString()
                })
                .OrderByDescending(n => n.ViewCount)
                .ToListAsync();
        }

        public async Task<RentalStatusStatsDto> GetStatusStatsAsync(int userId)
        {
            var now = DateTime.UtcNow;
            return new RentalStatusStatsDto
            {
                TotalPosts = await _context.NhaTros.Where(n => n.UserId == userId).CountAsync(),
                ActivePosts = await _context.NhaTros.Where(n => n.UserId == userId).CountAsync(n =>
                    n.Status == ApprovalStatus.Approved &&
                    n.ExpiredDate.HasValue && n.ExpiredDate.Value.Date >= now),
                ExpiredPosts = await _context.NhaTros.Where(n => n.UserId == userId).CountAsync(n =>
                    n.ExpiredDate != null && n.ExpiredDate < now), // Thay đổi >= thành <
                PendingPosts = await _context.NhaTros.Where(n => n.UserId == userId).CountAsync(n =>
                    n.Status == ApprovalStatus.Pending)
            };
        }

        public async Task<Response> UpdateAsync(NhaTro entity)
        {
            try
            {
                var existingNhaTro = await _context.NhaTros
                    .Include(n => n.Images)
                    .FirstOrDefaultAsync(n => n.Id == entity.Id);

                if (existingNhaTro == null)
                {
                    return new Response(false, "Không tìm thấy dữ liệu nhà trọ!");
                }

                // Cập nhật các thuộc tính của nhà trọ
                existingNhaTro.Title = entity.Title;
                existingNhaTro.Address = entity.Address;
                existingNhaTro.Description = entity.Description;
                existingNhaTro.DescriptionHtml = entity.DescriptionHtml;
                existingNhaTro.Url = entity.Url;
                existingNhaTro.Price = entity.Price;
                existingNhaTro.PriceExt = entity.PriceExt;
                existingNhaTro.Area = entity.Area;
                existingNhaTro.BedRoom = entity.BedRoom;
                existingNhaTro.PostedDate = entity.PostedDate;
                existingNhaTro.ExpiredDate = entity.ExpiredDate;
                existingNhaTro.Type = entity.Type;
                existingNhaTro.Code = entity.Code;
                existingNhaTro.BedRoomCount = entity.BedRoomCount;
                existingNhaTro.BathRoom = entity.BathRoom;
                existingNhaTro.Furniture = entity.Furniture;
                existingNhaTro.Latitude = entity.Latitude;
                existingNhaTro.Longitude = entity.Longitude;
                existingNhaTro.PriceBil = entity.PriceBil;
                existingNhaTro.PriceMil = entity.PriceMil;
                existingNhaTro.PriceVnd = entity.PriceVnd;
                existingNhaTro.AreaM2 = entity.AreaM2;
                existingNhaTro.PricePerM2 = entity.PricePerM2;

                // Cập nhật danh sách hình ảnh
                if (entity.Images != null && entity.Images.Any())
                {
                    // Xóa các hình ảnh cũ
                    _context.NhaTroImages.RemoveRange(existingNhaTro.Images);

                    // Thêm các hình ảnh mới
                    foreach (var image in entity.Images)
                    {
                        var nhaTroImage = new NhaTroImage
                        {
                            ImageUrl = image.ImageUrl,
                            NhaTroID = existingNhaTro.Id
                        };
                        _context.NhaTroImages.Add(nhaTroImage);
                    }
                }

                await _context.SaveChangesAsync();

                return new Response(true, "Dữ liệu nhà trọ đã được cập nhật thành công");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Xảy ra lỗi khi tìm dữ liệu nhà trọ liên quan!");
            }
        }

        public async Task<Response> UpdateStatus(int nhaTroId, int status, string reason)
        {
            try
            {
                var findNhaTro = await _context.NhaTros.FirstOrDefaultAsync(n => n.Id == nhaTroId);
                if (findNhaTro == null)
                {
                    return new Response(false, "Không tìm thấy dữ liệu nhà trọ!");
                }

                if (status == 0)
                {
                    findNhaTro.Status = ApprovalStatus.Rejected;
                    if (reason != null)
                    {
                        findNhaTro.RejectionReason = reason;
                    }
                    else
                    {
                        return new Response(false, "Bạn cần điền lý do từ chối xét duyệt");
                    }
                }

                if (status == 1)
                {
                    findNhaTro.Status = ApprovalStatus.Approved;
                }

                _context.Entry(findNhaTro).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return new Response(true, "Nhà trọ đã được duyệt thành công");

            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Xảy ra lỗi khi duyệt nhà trọ!");
            }
        }

        public async Task<Response> UpdateActive(int id, bool status)
        {
            try
            {
                var nhatro = await _context.NhaTros.FindAsync(id);
                if (nhatro!.Id < 1)
                {
                    return new Response(false, "Không tìm thấy thông tin nhà trọ!");
                }

                nhatro.IsActive = status;
                _context.NhaTros.Update(nhatro);
                await _context.SaveChangesAsync();

                return new Response(true, "Cập nhật active thành công!");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new Response(false, ex.Message);
            }
        }

        public async Task<PagedResultDTO<NhaTroDTO>> SearchNhaTros(SearchNhaTroDTO searchParams)
        {
            try
            {
                var query = _context.NhaTros
                    .AsNoTracking()
                    .Include(n => n.Images)
                    .Include(n => n.User)
                    .AsQueryable();

                // Áp dụng các điều kiện tìm kiếm
                if (!string.IsNullOrEmpty(searchParams.Title))
                {
                    query = query.Where(n => n.Title.Contains(searchParams.Title));
                }

                if (searchParams.Status.HasValue)
                {
                    query = query.Where(n => (int)n.Status == searchParams.Status.Value);
                }

                if (searchParams.IsActive.HasValue)
                {
                    query = query.Where(n => n.IsActive == searchParams.IsActive.Value);
                }

                if (searchParams.MinPrice.HasValue)
                {
                    query = query.Where(n => n.Price >= searchParams.MinPrice.Value);
                }

                if (searchParams.MaxPrice.HasValue)
                {
                    query = query.Where(n => n.Price <= searchParams.MaxPrice.Value);
                }

                if (searchParams.MinArea.HasValue)
                {
                    query = query.Where(n => n.Area >= searchParams.MinArea.Value);
                }

                if (searchParams.MaxArea.HasValue)
                {
                    query = query.Where(n => n.Area <= searchParams.MaxArea.Value);
                }

                // Tính tổng số mục
                var totalItems = await query.CountAsync();

                // Phân trang kết quả
                var pagedData = await query
                    .OrderByDescending(n => n.PostedDate)
                    .Skip((searchParams.Page - 1) * searchParams.PageSize)
                    .Take(searchParams.PageSize)
                    .ToListAsync();

                var (_, list) = NhaTroConversion.FromEntity(null, pagedData);

                return new PagedResultDTO<NhaTroDTO>(
                    TotalItems: totalItems,
                    TotalPages: (int)Math.Ceiling((double)totalItems / searchParams.PageSize),
                    Data: list ?? new List<NhaTroDTO>()
                );
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new InvalidOperationException("Xảy ra lỗi khi tìm kiếm nhà trọ!", ex);
            }
        }
    }
}
