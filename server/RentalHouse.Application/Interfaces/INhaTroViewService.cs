namespace RentalHouse.Application.Interfaces
{
    public interface INhaTroViewService
    {
        Task IncrementViewAsync(int nhaTroId, string? ipAddress, int? viewerId);
    }

}
