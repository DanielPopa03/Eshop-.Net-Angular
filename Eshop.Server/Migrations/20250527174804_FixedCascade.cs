using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eshop.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixedCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttributeCats_Categories_CategoryId",
                table: "AttributeCats");

            migrationBuilder.AddForeignKey(
                name: "FK_AttributeCats_Categories_CategoryId",
                table: "AttributeCats",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttributeCats_Categories_CategoryId",
                table: "AttributeCats");

            migrationBuilder.AddForeignKey(
                name: "FK_AttributeCats_Categories_CategoryId",
                table: "AttributeCats",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId");
        }
    }
}
