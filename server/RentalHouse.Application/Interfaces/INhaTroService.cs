namespace RentalHouse.Application.Interfaces
{
    public interface INhaTroService
    {
        Task<bool> IsOwner(int nhaTroId, int userId);
    }
}
