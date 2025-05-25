using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eshop.Server.Migrations
{
    /// <inheritdoc />
    public partial class UrlImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "ProductImages",
                newName: "ImageUrl");

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "ProductImages",
                newName: "Name");
        }
    }
}
