using System.Globalization;
using System.Text.RegularExpressions;

namespace RentalHouse.Application.Utils
{
    public static class PriceParserUtil
    {
        public static long ParsePrice(string priceText)
        {
            if (string.IsNullOrWhiteSpace(priceText))
                throw new ArgumentException("Giá không được để trống", nameof(priceText));

            // Chuẩn hóa chuỗi, loại bỏ khoảng trắng thừa
            priceText = priceText.Trim().ToLower();

            // Biểu thức chính quy nhận dạng số và đơn vị tỷ/triệu/nghìn
            var match = Regex.Match(priceText, @"\b(\d+(?:[,.]\d+)?)\s*(tỷ|ty|bil|triệu|tr|nghìn|k)\b");

            if (!match.Success)
                throw new FormatException("Định dạng giá không hợp lệ: " + priceText);

            decimal value = decimal.Parse(match.Groups[1].Value.Replace(',', '.'), CultureInfo.InvariantCulture);
            string unit = match.Groups[2].Value;

            // Chuyển đổi đơn vị
            if (unit == "tỷ" || unit == "ty" || unit == "bil") // tỷ
            {
                return (long)(value * 1_000_000_000);
            }
            else if (unit == "triệu" || unit == "tr") // triệu
            {
                return (long)(value * 1_000_000);
            }
            else if (unit == "nghìn" || unit == "k") // nghìn
            {
                return (long)(value * 1_000);
            }
            else
            {
                throw new FormatException("Đơn vị giá không hợp lệ: " + unit);
            }
        }
    }
}
