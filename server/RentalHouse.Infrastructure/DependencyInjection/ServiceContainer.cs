using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RentalHouse.Application.Interfaces;
using RentalHouse.Application.Services.NhaTro;
using RentalHouse.Infrastructure.Data;
using RentalHouse.Infrastructure.Repositories;
using RentalHouse.Infrastructure.Services.NhaTroView;
using RentalHouse.SharedLibrary.DependencyInjection;

namespace RentalHouse.Infrastructure.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration config)
        {
            SharedServiceContainer.AddSharedServices<RentalHouseDbContext>(services, config, config["MySerilog:FileName"]!);

            // DI DbContext for Repository be able to use it
            services.AddScoped<IRentalHouseDbContext>(provider => provider.GetRequiredService<RentalHouseDbContext>());

            // DI Repositories for Controller be able to use it
            services.AddScoped<INhaTroRepository, NhaTroRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IFavoriteRepository, FavoriteRepository>();
            services.AddScoped<IAddressRepository, AddressRepository>();
            services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            services.AddScoped<INhaTroService, NhaTroService>();
            services.AddScoped<IReportRepository, ReportRepository>();
            services.AddScoped<INhaTroViewService, NhaTroViewService>();
            return services;
        }

        public static IApplicationBuilder UseInfrastructurePolicy(this IApplicationBuilder app)
        {
            SharedServiceContainer.UseSharedPolicies(app);

            return app;
        }
    }
}
