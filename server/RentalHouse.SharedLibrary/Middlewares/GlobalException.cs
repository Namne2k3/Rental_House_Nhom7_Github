using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RentalHouse.SharedLibrary.Logs;
using System.Net;
using System.Text.Json;

namespace RentalHouse.SharedLibrary.Middlewares
{
    public class GlobalException
    {
        private readonly RequestDelegate _next;

        public GlobalException(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            // định nghĩa biến
            string message = "Lỗi phía Server. Vui lòng thử lại!";
            int statusCode = (int)HttpStatusCode.InternalServerError;
            string title = "Lỗi";

            try
            {
                await _next(context);

                // kiểm tra liệu Response có quá nhiều request hay không? status code: 429
                if (context.Response.StatusCode == StatusCodes.Status429TooManyRequests)
                {
                    title = "Chú ý";
                    message = "Quá nhiều yêu cầu. Vui lòng thử lại trong chốc lát!";
                    statusCode = (int)StatusCodes.Status429TooManyRequests;
                    await ModifyHeader(context, title, message, statusCode);
                }

                // kiểm tra liệu Response đã được xác thực hay chưa (Unauthorized)? status code: 401
                if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
                {
                    title = "Cảnh báo";
                    message = "Bạn cần đăng nhập để truy cập!";
                    statusCode = (int)StatusCodes.Status401Unauthorized;
                    await ModifyHeader(context, title, message, statusCode);
                }

                // kiểm tra liệu Response có bị chặn hay không vì không phải admin? status code: 403
                if (context.Response.StatusCode == StatusCodes.Status403Forbidden)
                {
                    title = "Không có quyền";
                    message = "Bạn không có quyền truy cập. Vui lòng liên hệ Admin!";
                    statusCode = (int)StatusCodes.Status403Forbidden;
                    await ModifyHeader(context, title, message, statusCode);
                }

            }
            catch (Exception ex)
            {
                // log ra Lỗi / Console / File / Debugger
                LogException.LogExceptions(ex);

                // kiểm tra liệu lỗi có bị timout? status code: 408
                if (ex is TaskCanceledException || ex is TimeoutException)
                {
                    title = "Quá thời gian thực thi";
                    message = "Vui lòng thử lại sau!";
                    statusCode = (int)StatusCodes.Status408RequestTimeout;
                    await ModifyHeader(context, title, message, statusCode);
                }
                // nếu không rơi và các lỗi trên thì log lỗi mặc định
                else
                {
                    await ModifyHeader(context, title, message, statusCode);
                }
            }
        }

        private static async Task ModifyHeader(HttpContext context, string title, string message, int statusCode)
        {
            // sửa đổi header
            context.Response.ContentType = "application/json";

            // sửa đổi response.body với hàm WriteAsync
            await context.Response.WriteAsync(
                JsonSerializer.Serialize(
                    new ProblemDetails()
                    {
                        Detail = message,
                        Status = statusCode,
                        Title = title
                    }
                ),
                CancellationToken.None
            );
            return;
        }
    }
}
