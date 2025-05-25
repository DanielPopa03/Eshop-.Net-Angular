using System.Text.Json.Serialization;

namespace Eshop.Server.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        [JsonIgnore]
        public ICollection<User> Users { get; set; } = [];
    }

}
