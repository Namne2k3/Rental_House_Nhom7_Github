﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RentalHouse.Infrastructure.Data;

#nullable disable

namespace RentalHouse.Infrastructure.Data.Migrations
{
    [DbContext(typeof(RentalHouseDbContext))]
    [Migration("20250328111745_init")]
    partial class init
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("RentalHouse.Domain.Entities.Addresses.Districts.District", b =>
                {
                    b.Property<int>("Code")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Code"));

                    b.Property<string>("CodeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DivisionType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProvinceCode")
                        .HasColumnType("int");

                    b.HasKey("Code");

                    b.HasIndex("ProvinceCode");

                    b.ToTable("Districts");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Addresses.Provinces.Province", b =>
                {
                    b.Property<int>("Code")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Code"));

                    b.Property<string>("CodeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DivisionType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PhoneCode")
                        .HasColumnType("int");

                    b.HasKey("Code");

                    b.ToTable("Provinces");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Addresses.Wards.Ward", b =>
                {
                    b.Property<int>("Code")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Code"));

                    b.Property<string>("CodeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("DistrictCode")
                        .HasColumnType("int");

                    b.Property<string>("DivisionType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Code");

                    b.HasIndex("DistrictCode");

                    b.ToTable("Wards");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Appointments.Appointment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AppointmentTime")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("NhaTroId")
                        .HasColumnType("int");

                    b.Property<string>("Notes")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int?>("UserId1")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("NhaTroId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("UserId");

                    b.HasIndex("UserId1");

                    b.ToTable("Appointments");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Appointments.AppointmentHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AppointmentId")
                        .HasColumnType("int");

                    b.Property<int>("ChangedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Notes")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.HasIndex("AppointmentId");

                    b.HasIndex("ChangedById");

                    b.ToTable("AppointmentHistories");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Auth.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateRegistered")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Favorites.Favorite", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateSaved")
                        .HasColumnType("datetime2");

                    b.Property<int>("NhaTroId")
                        .HasColumnType("int");

                    b.Property<int?>("NhaTroId1")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("NhaTroId");

                    b.HasIndex("NhaTroId1");

                    b.HasIndex("UserId");

                    b.ToTable("Favorites");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.NhaTros.NhaTro", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)");

                    b.Property<DateTime?>("ApprovedDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("Area")
                        .HasColumnType("int");

                    b.Property<float?>("AreaM2")
                        .HasColumnType("real");

                    b.Property<int?>("BathRoom")
                        .HasColumnType("int");

                    b.Property<int?>("BedRoom")
                        .HasColumnType("int");

                    b.Property<int?>("BedRoomCount")
                        .HasColumnType("int");

                    b.Property<string>("Code")
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(MAX)");

                    b.Property<string>("DescriptionHtml")
                        .HasColumnType("nvarchar(MAX)");

                    b.Property<DateTime?>("ExpiredDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Furniture")
                        .HasColumnType("nvarchar(255)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("LastUpdatedDate")
                        .HasColumnType("datetime2");

                    b.Property<float?>("Latitude")
                        .HasColumnType("real");

                    b.Property<float?>("Longitude")
                        .HasColumnType("real");

                    b.Property<DateTime?>("PostedDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("Price")
                        .HasColumnType("int");

                    b.Property<float?>("PriceBil")
                        .HasColumnType("real");

                    b.Property<string>("PriceExt")
                        .HasColumnType("nvarchar(50)");

                    b.Property<float?>("PriceMil")
                        .HasColumnType("real");

                    b.Property<float?>("PricePerM2")
                        .HasColumnType("real");

                    b.Property<float?>("PriceVnd")
                        .HasColumnType("real");

                    b.Property<string>("RejectionReason")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Type")
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Url")
                        .HasColumnType("nvarchar(500)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("ViewCount")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("NhaTros");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.NhaTros.NhaTroImage", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("NhaTroID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("NhaTroID");

                    b.ToTable("NhaTroImages");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.NhaTros.NhaTroView", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("NhaTroId")
                        .HasColumnType("int");

                    b.Property<DateTime>("ViewedAt")
                        .HasColumnType("datetime2");

                    b.Property<int?>("ViewerId")
                        .HasColumnType("int");

                    b.Property<string>("ViewerIp")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("NhaTroId");

                    b.HasIndex("ViewerId");

                    b.ToTable("NhaTroViews");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Reports.Report", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("NhaTroId")
                        .HasColumnType("int");

                    b.Property<string>("ReportType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("NhaTroId");

                    b.HasIndex("UserId");

                    b.ToTable("Reports");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Reports.ReportImage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ReportId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ReportId");

                    b.ToTable("ReportImages");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Addresses.Districts.District", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.Addresses.Provinces.Province", "Province")
                        .WithMany("Districts")
                        .HasForeignKey("ProvinceCode")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Province");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Addresses.Wards.Ward", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.Addresses.Districts.District", "District")
                        .WithMany("Wards")
                        .HasForeignKey("DistrictCode")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("District");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Appointments.Appointment", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.NhaTros.NhaTro", "NhaTro")
                        .WithMany()
                        .HasForeignKey("NhaTroId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RentalHouse.Domain.Entities.Auth.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("RentalHouse.Domain.Entities.Auth.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RentalHouse.Domain.Entities.Auth.User", null)
                        .WithMany("Appointments")
                        .HasForeignKey("UserId1");

                    b.Navigation("NhaTro");

                    b.Navigation("Owner");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Appointments.AppointmentHistory", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.Appointments.Appointment", "Appointment")
                        .WithMany()
                        .HasForeignKey("AppointmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RentalHouse.Domain.Entities.Auth.User", "ChangedBy")
                        .WithMany()
                        .HasForeignKey("ChangedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Appointment");

                    b.Navigation("ChangedBy");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Favorites.Favorite", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.NhaTros.NhaTro", "NhaTro")
                        .WithMany()
                        .HasForeignKey("NhaTroId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RentalHouse.Domain.Entities.NhaTros.NhaTro", null)
                        .WithMany("Favorites")
                        .HasForeignKey("NhaTroId1");

                    b.HasOne("RentalHouse.Domain.Entities.Auth.User", "User")
                        .WithMany("Favorites")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("NhaTro");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.NhaTros.NhaTro", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.Auth.User", "User")
                        .WithMany("Nhatros")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.NhaTros.NhaTroImage", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.NhaTros.NhaTro", "NhaTro")
                        .WithMany("Images")
                        .HasForeignKey("NhaTroID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("NhaTro");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.NhaTros.NhaTroView", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.NhaTros.NhaTro", "NhaTro")
                        .WithMany("Views")
                        .HasForeignKey("NhaTroId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RentalHouse.Domain.Entities.Auth.User", "Viewer")
                        .WithMany()
                        .HasForeignKey("ViewerId");

                    b.Navigation("NhaTro");

                    b.Navigation("Viewer");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Reports.Report", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.NhaTros.NhaTro", "NhaTro")
                        .WithMany()
                        .HasForeignKey("NhaTroId");

                    b.HasOne("RentalHouse.Domain.Entities.Auth.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("NhaTro");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Reports.ReportImage", b =>
                {
                    b.HasOne("RentalHouse.Domain.Entities.Reports.Report", "Report")
                        .WithMany("Images")
                        .HasForeignKey("ReportId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Report");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Addresses.Districts.District", b =>
                {
                    b.Navigation("Wards");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Addresses.Provinces.Province", b =>
                {
                    b.Navigation("Districts");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Auth.User", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("Favorites");

                    b.Navigation("Nhatros");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.NhaTros.NhaTro", b =>
                {
                    b.Navigation("Favorites");

                    b.Navigation("Images");

                    b.Navigation("Views");
                });

            modelBuilder.Entity("RentalHouse.Domain.Entities.Reports.Report", b =>
                {
                    b.Navigation("Images");
                });
#pragma warning restore 612, 618
        }
    }
}
