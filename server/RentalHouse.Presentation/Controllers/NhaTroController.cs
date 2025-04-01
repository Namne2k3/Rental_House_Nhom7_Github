using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentalHouse.Application.DTOs;
using RentalHouse.Application.DTOs.Conversions;
using RentalHouse.Application.Interfaces;
using RentalHouse.SharedLibrary.Responses;
using System.Security.Claims;
using System.Text.Json;

namespace RentalHouse.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowOrigin")]
    public class NhaTroController : ControllerBase
    {
        private readonly INhaTroRepository _repository;
        private readonly INhaTroService _service;
        private readonly IConfiguration _configuration;
        private readonly INhaTroViewService _nhaTroViewService;
        public NhaTroController(INhaTroRepository repository, INhaTroService service, IConfiguration configuration, INhaTroViewService nhaTroViewService)
        {
            _repository = repository;
            _service = service;
            _configuration = configuration;
            _nhaTroViewService = nhaTroViewService;
        }
        [HttpPut("UpdateActive/{id:int}")]
        public async Task<ActionResult<Response>> UpdateActive(int id, [FromBody] Boolean isActive)
        {
            var response = await _repository.UpdateActive(id, isActive);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpGet("view-stats")]
        public async Task<ActionResult<IEnumerable<RentalViewStatsDto>>> GetViewStats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var stats = await _repository.GetViewStatsAsync(int.Parse(userId!));
            return Ok(stats);
        }

        [HttpGet("status-stats")]
        public async Task<ActionResult<RentalStatusStatsDto>> GetStatusStats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var stats = await _repository.GetStatusStatsAsync(int.Parse(userId!));
            return Ok(stats);
        }

        [HttpGet("GetNhaTros")]
        public async Task<ActionResult<IEnumerable<NhaTroDTO>>> GetNhaTros()
        {
            // cách để lấy ra thông tin được mã hóa trong token
            //var userId = User.FindFirst(ClaimTypes.Email)?.Value;
            var nhatros = await _repository.GetAllAsync();
            if (!nhatros.Any())
            {
                return NotFound("Không tìm thấy nhà trọ trong cơ sở dữ liệu!");
            }

            var (_, list) = NhaTroConversion.FromEntity(null, nhatros);
            return list!.Any() ? Ok(list) : NotFound("Không tìm thấy nhà trọ!");
        }

        [HttpGet("GetAllNhaTros")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResultDTO<NhaTroDTO>>> GetAllNhaTros(int page, int pageSize)
        {
            var nhatros = await _repository.GetAllNhaTros(page, pageSize);
            if (!nhatros.Data!.Any())
            {
                return NotFound("Không tìm thấy nhà trọ!");
            }

            return nhatros.Data!.Any() ? Ok(nhatros) : NotFound("Không tìm thấy nhà trọ!");
        }

        [HttpGet("GetNhaTrosWithFilters")]
        public async Task<ActionResult<PagedResultDTO<NhaTroDTO>>> GetNhaTrosWithFilters([FromQuery] FilterNhaTroDTO filterNhaTroDTO)
        {
            // cách để lấy ra thông tin được mã hóa trong token
            //var userId = User.FindFirst(ClaimTypes.Email)?.Value;
            var nhatros = await _repository.GetAllAsyncWithFilters(
                filterNhaTroDTO.page != 0 ? filterNhaTroDTO.page : 1,
                filterNhaTroDTO.pageSize != 0 ? filterNhaTroDTO.pageSize : 20,
                filterNhaTroDTO.city!,
                filterNhaTroDTO.district!,
                filterNhaTroDTO.commune!,
                filterNhaTroDTO.street!,
                filterNhaTroDTO.address!,
                filterNhaTroDTO.price1!,
                filterNhaTroDTO.price2!,
                filterNhaTroDTO.area1!,
                filterNhaTroDTO.area2!,
                filterNhaTroDTO.bedRoomCount!,
                filterNhaTroDTO.userId
            );

            if (!nhatros.Data!.Any())
            {
                return NotFound("Không tìm thấy nhà trọ!");
            }

            return nhatros.Data!.Any() ? Ok(nhatros) : NotFound("Không tìm thấy nhà trọ!");
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Response>> CreateNhaTro([FromForm] string nhaTroData, [FromForm] List<IFormFile> images)
        {
            try
            {
                if (string.IsNullOrEmpty(nhaTroData))
                {
                    return BadRequest(new Response { IsSuccess = false, Message = "Dữ liệu không hợp lệ" });
                }

                var nhaTroDTO = JsonSerializer.Deserialize<NhaTroCreateRequestDTO>(nhaTroData, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (images == null || !images.Any())
                {
                    return BadRequest(new Response { IsSuccess = false, Message = "Chưa cung cấp hình ảnh" });
                }

                var imageUrls = await UploadImages(images);
                if (!imageUrls.Any())
                {
                    return BadRequest(new Response { IsSuccess = false, Message = "Lỗi khi tải ảnh lên" });
                }

                var nhaTro = NhaTroConversion.RequestDTOToNhaTro(nhaTroDTO);
                var response = await _repository.CreateAsync(nhaTro, imageUrls);

                return response.IsSuccess ? Ok(response) : BadRequest(response);
            }
            catch (JsonException ex)
            {
                return BadRequest(new Response { IsSuccess = false, Message = "Lỗi định dạng dữ liệu: " + ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new Response { IsSuccess = false, Message = "Lỗi server: " + ex.Message });
            }
        }

        private async Task<List<string>> UploadImages(List<IFormFile> files)
        {
            var imageUrls = new List<string>();
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            // Get server URL from configuration
            var serverUrl = _configuration["ServerUrl"];

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

                    if (!allowedExtensions.Contains(extension))
                    {
                        continue;
                    }

                    var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                        // Store full URL in database
                        imageUrls.Add($"{serverUrl}/uploads/{uniqueFileName}");
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
            }

            return imageUrls;
        }

        [HttpDelete]
        [Authorize]
        public async Task<ActionResult<Response>> DeleteNhaTro(NhaTroDTO nhaTroDTO)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = int.Parse(userIdClaim!);

            if (!await _service.IsOwner(nhaTroDTO.Id, userId))
            {
                return Forbid("Bạn không có quyền xóa thông tin nhà trọ này!");
            }

            var nhatro = NhaTroConversion.ToEntity(nhaTroDTO);
            var response = await _repository.DeleteAsync(nhatro);

            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }
        [HttpGet("GetNhaTroById")]
        public async Task<ActionResult<NhaTroDTO>> GetNhaTroById(int id)
        {

            var nhatro = await _repository.FindByIdAsync(id);
            if (nhatro is null)
            {
                return NoContent();
            }
            var (nhatroDTO, _) = NhaTroConversion.FromEntity(nhatro, null);

            if (nhatro != null)
            {
                string? ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                int? viewerId = User.Identity?.IsAuthenticated == true ?
                int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0") : null;
                await _nhaTroViewService.IncrementViewAsync(id, ipAddress, viewerId);
            }
            return nhatroDTO?.Id > 0 ? Ok(nhatroDTO) : BadRequest(nhatroDTO);
        }


        [HttpGet("GetRelatedNhaTros")]
        public async Task<ActionResult<IEnumerable<NhaTroDTO>>> GetRelatedNhaTros(int id)
        {
            var relatedNhaTros = await _repository.GetRelateNhaTrosAsync(id, 4);
            return relatedNhaTros.Any() ? Ok(relatedNhaTros) : BadRequest(relatedNhaTros);
        }


        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Response>> UpdateNhaTro([FromBody] NhaTroUpdateRequestDTO nhaTroDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nhaTro = NhaTroConversion.ToEntity(nhaTroDTO);
            var response = await _repository.UpdateAsync(nhaTro);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpPut("updateStatus/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Response>> UpdateStatusNhaTro(int id, [FromBody] UpdateStatusNhaTroDTO updateStatusNhaTroDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var response = await _repository.UpdateStatus(id, updateStatusNhaTroDTO.status, updateStatusNhaTroDTO.reason!);
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }

        [HttpGet("GetAllNhaTrosByUserId/{id:int}")]
        [Authorize]
        public async Task<ActionResult<PagedResultDTO<NhaTroDTO>>> GetAllNhaTroByUserId(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var nhatros = await _repository.GetAllNhaTrosByUserId(id);
            return nhatros.Data!.Any() ? Ok(nhatros) : NotFound("Không tìm thấy nhà trọ!");
        }

        [HttpGet("search")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResultDTO<NhaTroDTO>>> SearchNhaTros(
            [FromQuery] string? title,
            [FromQuery] int? status,
            [FromQuery] bool? isActive,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] decimal? minArea,
            [FromQuery] decimal? maxArea,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var searchParams = new SearchNhaTroDTO
                {
                    Title = title,
                    Status = status,
                    IsActive = isActive,
                    MinPrice = minPrice,
                    MaxPrice = maxPrice,
                    MinArea = minArea,
                    MaxArea = maxArea,
                    Page = page,
                    PageSize = pageSize
                };

                var result = await _repository.SearchNhaTros(searchParams);

                if (!result.Data.Any())
                {
                    return NotFound(new { message = "Không tìm thấy nhà trọ nào phù hợp với điều kiện tìm kiếm." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Có lỗi xảy ra khi tìm kiếm: " + ex.Message });
            }
        }
    }
}
