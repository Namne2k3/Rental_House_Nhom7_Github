using RentalHouse.Domain.Entities.NhaTros;

namespace RentalHouse.Application.DTOs.Conversions
{
    public static class NhaTroConversion
    {
        public static NhaTro RequestDTOToNhaTro(NhaTroCreateRequestDTO requestDTO)
        {
            return new NhaTro()
            {
                Title = requestDTO.Title,
                Address = requestDTO.Address,
                Description = requestDTO.Description,
                Price = requestDTO.Price,
                Area = requestDTO.Area,
                BedRoom = requestDTO.BedRoomCount,
                PostedDate = requestDTO.PostedDate,
                ExpiredDate = requestDTO.ExpiredDate,
                BedRoomCount = requestDTO.BedRoomCount,
                BathRoom = requestDTO.BathRoom,
                Furniture = requestDTO.Furniture,
                Latitude = requestDTO.Latitude,
                Longitude = requestDTO.Longitude,
                UserId = requestDTO.UserId
            };
        }

        public static NhaTro ToEntity(NhaTroUpdateRequestDTO nhatroDTO)
        {
            return new NhaTro
            {
                Id = nhatroDTO.Id,
                Title = nhatroDTO.Title,
                Address = nhatroDTO.Address,
                Description = nhatroDTO.Description,
                DescriptionHtml = nhatroDTO.DescriptionHtml,
                Url = nhatroDTO.Url,
                Price = nhatroDTO.Price,
                PriceExt = nhatroDTO.PriceExt,
                Area = nhatroDTO.Area,
                BedRoom = nhatroDTO.BedRoom,
                PostedDate = nhatroDTO.PostedDate,
                ExpiredDate = nhatroDTO.ExpiredDate,
                Type = nhatroDTO.Type,
                Code = nhatroDTO.Code,
                BedRoomCount = nhatroDTO.BedRoomCount,
                BathRoom = nhatroDTO.BathRoom,
                Furniture = nhatroDTO.Furniture,
                Latitude = nhatroDTO.Latitude,
                Longitude = nhatroDTO.Longitude,
                PriceBil = nhatroDTO.PriceBil,
                PriceMil = nhatroDTO.PriceMil,
                PriceVnd = nhatroDTO.PriceVnd,
                AreaM2 = nhatroDTO.AreaM2,
                PricePerM2 = nhatroDTO.PricePerM2,
                Images = nhatroDTO.ImageUrls.Select(url => new NhaTroImage { ImageUrl = url }).ToList()
            };
        }
        public static NhaTro ToEntity(NhaTroDTO nhatro)
        {
            return new()
            {
                Id = nhatro.Id,
                Title = nhatro.Title,
                Address = nhatro.Address,
                Description = nhatro.Description,
                DescriptionHtml = nhatro.DescriptionHtml,
                Url = nhatro.Url,
                Price = nhatro.Price,
                PriceExt = nhatro.PriceExt,
                Area = nhatro.Area,
                BedRoom = nhatro.BedRoom,
                PostedDate = nhatro.PostedDate,
                ExpiredDate = nhatro.ExpiredDate,
                Type = nhatro.Type,
                Code = nhatro.Code,
                BedRoomCount = nhatro.BedRoomCount,
                BathRoom = nhatro.BathRoom,
                Furniture = nhatro.Furniture,
                Latitude = nhatro.Latitude,
                Longitude = nhatro.Longitude,
                PriceBil = nhatro.PriceBil,
                PriceMil = nhatro.PriceMil,
                PriceVnd = nhatro.PriceVnd,
                AreaM2 = nhatro.AreaM2,
                PricePerM2 = nhatro.PricePerM2,
                Images = nhatro.ImageUrls.Select(url => new NhaTroImage { ImageUrl = url }).ToList(),
                UserId = nhatro.UserId
            };
        }

        public static (NhaTroDTO?, IEnumerable<NhaTroDTO>?) FromEntity(NhaTro? nhaTro, IEnumerable<NhaTro>? nhaTros)
        {
            // Trả về một đối tượng NhaTroDTO nếu chỉ có một NhaTro được truyền vào
            if (nhaTro is not null || nhaTros is null)
            {
                var singleNhaTro = new NhaTroDTO(
                    nhaTro!.Id,
                    nhaTro.Title,
                    nhaTro.Address,
                    nhaTro.Description,
                    nhaTro.DescriptionHtml,
                    nhaTro.Url,
                    nhaTro.Price,
                    nhaTro.PriceExt,
                    nhaTro.Area,
                    nhaTro.BedRoom,
                    nhaTro.PostedDate,
                    nhaTro.ExpiredDate,
                    nhaTro.Type,
                    nhaTro.Code,
                    nhaTro.BedRoomCount,
                    nhaTro.BathRoom,
                    nhaTro.Furniture,
                    nhaTro.Latitude,
                    nhaTro.Longitude,
                    nhaTro.PriceBil,
                    nhaTro.PriceMil,
                    nhaTro.PriceVnd,
                    nhaTro.AreaM2,
                    nhaTro.PricePerM2,
                    nhaTro.Images.Select(img => img.ImageUrl).ToList(), // Chuyển danh sách ảnh sang List<string>,
                    nhaTro.UserId,
                    nhaTro.User!.FullName,
                    nhaTro.User!.PhoneNumber!,
                    nhaTro.User!.Email,
                    nhaTro.Status,
                    nhaTro.IsActive
                );

                return (singleNhaTro, null);
            }

            // Trả về danh sách NhaTroDTO nếu có nhiều NhaTro được truyền vào
            if (nhaTros is not null || nhaTro is null)
            {
                var _nhaTros = nhaTros!.Select(nt =>
                {
                    return new NhaTroDTO(
                        nt.Id,
                        nt.Title,
                        nt.Address,
                        nt.Description,
                        nt.DescriptionHtml,
                        nt.Url,
                        nt.Price,
                        nt.PriceExt,
                        nt.Area,
                        nt.BedRoom,
                        nt.PostedDate,
                        nt.ExpiredDate,
                        nt.Type,
                        nt.Code,
                        nt.BedRoomCount,
                        nt.BathRoom,
                        nt.Furniture,
                        nt.Latitude,
                        nt.Longitude,
                        nt.PriceBil,
                        nt.PriceMil,
                        nt.PriceVnd,
                        nt.AreaM2,
                        nt.PricePerM2,
                        nt.Images.Select(img => img.ImageUrl).ToList(),
                        nt.UserId,
                        nt.User!.FullName,
                        nt.User.PhoneNumber!,
                        nt.User!.Email,
                        nt.Status,
                        nt.IsActive
                    );
                }
                ).ToList();

                return (null, _nhaTros);
            }

            return (null, null);
        }

    }
}
