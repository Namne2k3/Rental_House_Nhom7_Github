using Microsoft.AspNetCore.Mvc;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.DTOs.Conversions;
using RentalHouse.Application.Interfaces;
using RentalHouse.Domain.Entities.Favorites;
using RentalHouse.SharedLibrary.Responses;
using System.Security.Claims;

namespace RentalHouse.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowOrigin")]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteRepository _repository;
        public FavoriteController(IFavoriteRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("AddFavorite")]
        public async Task<ActionResult<FavoriteResponse>> AddFavorite(FavoriteDTO favoriteDTO)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            if (userId != null && favoriteDTO.id <= 0)
            {
                return BadRequest("Không tìm thấy ID của tài khoản hoặc thông tin nhà trọ!");
            }

            var favEntity = FavoriteConversion.ToFavorite(favoriteDTO);
            favEntity.UserId = int.Parse(userId!);

            var result = await _repository.CreateAsync(favEntity);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("DeleteFavorite")]
        public async Task<ActionResult<Response>> RemoveFavorite([FromQuery] FavoriteDTO favoriteDTO)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            if (userId == null || favoriteDTO.id <= 0)
            {
                return BadRequest("Không tìm thấy ID của tài khoản hoặc thông tin nhà trọ!");
            }
            var favEntity = FavoriteConversion.ToFavoriteDelete(favoriteDTO);
            favEntity.UserId = int.Parse(userId!);
            var result = await _repository.DeleteAsync(favEntity);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("GetFavoritesByCurrentUser")]
        public async Task<ActionResult<IEnumerable<Favorite>>> GetFavoritesByCurrentUser()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            if (userId == null)
            {
                return BadRequest("Không tìm thấy ID của tài khoản!");
            }
            var favEntities = await _repository.GetFavoritesByUserIdAsync(int.Parse(userId!));
            //var listSavedRetalIds = FavoriteConversion.ToListSavedRentalId(favEntities);

            //return listSavedRetalIds.Any() ? Ok(listSavedRetalIds) : BadRequest(listSavedRetalIds);
            return favEntities.Any() ? Ok(favEntities) : BadRequest(favEntities);

        }
    }
}
