using RentalHouse.Application.Interfaces;

namespace RentalHouse.Application.Services.NhaTro
{
    public class NhaTroService : INhaTroService
    {
        private readonly INhaTroRepository _repository;
        public NhaTroService(INhaTroRepository repository)
        {
            _repository = repository;
        }
        public async Task<bool> IsOwner(int nhaTroId, int userId)
        {
            var nhatro = await _repository.FindByIdAsync(nhaTroId);
            return nhatro != null && nhatro.UserId == userId;
        }
    }
}
