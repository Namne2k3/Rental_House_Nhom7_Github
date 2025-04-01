using System.Globalization;
using System.Text.RegularExpressions;

namespace RentalHouse.Application.Utils
{
    public static class AreaParserUtil
    {
        public static int ParseArea(string areaText)
        {
            if (string.IsNullOrWhiteSpace(areaText))
                throw new ArgumentException("Diện tích không được để trống", nameof(areaText));

            // Chuẩn hóa chuỗi, loại bỏ khoảng trắng thừa
            areaText = areaText.Trim().ToLower();

            // Biểu thức chính quy để tìm số và đơn vị diện tích (m² hoặc mét vuông)
            var match = Regex.Match(areaText, @"(\d+(?:[,.]\d+)?)\s*(m²|m2|mét vuông)");

            if (!match.Success)
                throw new FormatException("Định dạng diện tích không hợp lệ: " + areaText);

            // Chuyển số từ chuỗi sang số thực
            decimal value = decimal.Parse(match.Groups[1].Value.Replace(',', '.'), CultureInfo.InvariantCulture);

            // Trả về diện tích dạng số nguyên
            return (int)value;
        }
    }
}
