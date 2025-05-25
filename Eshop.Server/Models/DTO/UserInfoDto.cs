namespace Eshop.Server.Models.DTO
{
    public class UserInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public UserInfoDto(User u)
        {
            this.Id = u.Id;
            this.Name = u.LastName + " " + u.FirstName;
            this.Email = u.Email;
        }
    }
}
