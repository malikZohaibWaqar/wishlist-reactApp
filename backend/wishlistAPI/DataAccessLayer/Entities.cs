using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class CategoryEntity
    {
        [Key]
        public int id { get; set; }
        public string category { get; set; }
    }
    public class TaskEntity
    {
        [Key]
        public int id { get; set; }
        public string task { get; set; }
        public DateTime dateCreated { get; set; }
        public DateTime dateDue { get; set; }

        public string priority { get; set; }
        public string status { get; set; }
        public int categoryId { get; set; }

    }
}
