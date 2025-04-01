using System.Globalization;
using System.Text.RegularExpressions;

namespace RentalHouse.Application.Utils
{
    public static class RoomParserUtil
    {
        public static int ParseRoomCount(string roomText)
        {
            if (string.IsNullOrWhiteSpace(roomText))
                throw new ArgumentException("Số phòng không được để trống", nameof(roomText));

            // Chuẩn hóa chuỗi, loại bỏ khoảng trắng thừa
            roomText = roomText.Trim().ToLower();

            // Biểu thức chính quy để tìm số và từ "phòng"
            var match = Regex.Match(roomText, @"(\d+)\s*(phòng)");

            if (!match.Success)
                throw new FormatException("Định dạng số phòng không hợp lệ: " + roomText);

            // Chuyển số từ chuỗi sang số nguyên
            return int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
        }
    }
}
