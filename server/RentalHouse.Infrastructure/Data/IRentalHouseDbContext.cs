using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RentalHouse.Domain.Entities.Addresses.Districts;
using RentalHouse.Domain.Entities.Addresses.Provinces;
using RentalHouse.Domain.Entities.Addresses.Wards;
using RentalHouse.Domain.Entities.Appointments;
using RentalHouse.Domain.Entities.Auth;
using RentalHouse.Domain.Entities.Favorites;
using RentalHouse.Domain.Entities.NhaTros;
using RentalHouse.Domain.Entities.Reports;

namespace RentalHouse.Infrastructure.Data
{
    public interface IRentalHouseDbContext
    {
        DbSet<NhaTro> NhaTros { get; set; }
        DbSet<NhaTroImage> NhaTroImages { get; set; }
        DbSet<User> Users { get; set; }
        DbSet<Favorite> Favorites { get; set; }
        DbSet<District> Districts { get; set; }
        DbSet<Province> Provinces { get; set; }
        DbSet<Ward> Wards { get; set; }
        DbSet<Report> Reports { get; set; }
        DbSet<NhaTroView> NhaTroViews { get; set; }
        DbSet<ReportImage> ReportImages { get; set; }
        DbSet<Appointment> Appointments { get; set; }
        DbSet<AppointmentHistory> AppointmentHistories { get; set; }
        EntityEntry Entry(object entity);
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
