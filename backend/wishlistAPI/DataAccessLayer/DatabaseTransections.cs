using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class DatabaseTransections : DbContext
    {
        public DatabaseTransections() : base("name=ConStr") { }

        public virtual DbSet<CategoryEntity> Category { get; set; }
        public virtual DbSet<TaskEntity> Task { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CategoryEntity>().ToTable("tblCategory");
            modelBuilder.Entity<TaskEntity>().ToTable("tblTask");
        }
    }
}


