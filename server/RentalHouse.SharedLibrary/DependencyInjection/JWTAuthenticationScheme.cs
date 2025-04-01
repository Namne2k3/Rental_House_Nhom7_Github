using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace RentalHouse.SharedLibrary.DependencyInjection
{
    public static class JWTAuthenticationScheme
    {
        public static IServiceCollection AddJWTAuthenticationScheme(this IServiceCollection services, IConfiguration config)
        {
            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer("Bearer", options =>
                {
                    // Khóa bí mật để mã hóa/giải mã token.
                    var key = Encoding.UTF8.GetBytes(config.GetSection("Authentication:Key").Value!);

                    // (Người phát hành) là hệ thống phát hành token (ví dụ: API của bạn).
                    string issuer = config.GetSection("Authentication:Issuer").Value!;

                    // (Đối tượng nhận) là ứng dụng hoặc dịch vụ sẽ sử dụng token.
                    string audience = config.GetSection("Authentication:Audience").Value!;

                    // nếu true, yêu cầu ứng dụng chỉ hoạt động qua https
                    options.RequireHttpsMetadata = true;

                    // nếu true, token đã xác thực sẽ được lưu trong HttpContext để sử dụng sau
                    options.SaveToken = true;

                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidIssuer = issuer, // Giá trị Issuer hợp lệ (lấy từ file cấu hình).
                        ValidAudience = audience, // Giá trị Audience hợp lệ (lấy từ file cấu hình)
                        IssuerSigningKey = new SymmetricSecurityKey(key), // Khóa bí mật để giải mã và kiểm tra chữ ký của token
                        ValidateIssuer = true, // Kiểm tra xem Issuer của token có khớp với giá trị ValidIssuer không.
                        ValidateAudience = true, // Kiểm tra xem Audience của token có khớp với giá trị ValidAudience không.
                        ValidateLifetime = false, // (Hiện tại là false) Nếu là true, nó sẽ kiểm tra xem token đã hết hạn hay chưa.
                        ValidateIssuerSigningKey = true, // Kiểm tra tính hợp lệ của khóa ký (Signing Key) được sử dụng để mã hóa/giải mã token.
                    };
                });

            return services;
        }
    }
}
