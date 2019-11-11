using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FishersSite.Migrations
{
    public partial class ChangedUserEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordSalt",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "PaswordHash",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordSalt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PaswordHash",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "Users");
        }
    }
}
