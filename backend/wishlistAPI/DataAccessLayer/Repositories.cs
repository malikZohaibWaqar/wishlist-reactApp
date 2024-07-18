using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class CategoryRepository
    {
        private readonly DatabaseTransections transaction;
        public CategoryRepository(DatabaseTransections _transection) { transaction = _transection; }

        public int AddCategory(CategoryEntity category)
        {
            transaction.Category.Add(category);
            return transaction.SaveChanges();
        }
        public void DeleteCategory(CategoryEntity category)
        {
            transaction.Category.Remove(category);
            transaction.SaveChanges();
        }
        public void UpdateCategory(CategoryEntity categoryExisting, CategoryEntity categoryUpdated)
        {
            categoryExisting.category = categoryUpdated.category;
            transaction.SaveChanges();
        }
        public CategoryEntity GetCategoryByID(int categoryID)
        {
            return transaction.Category.Where(m => m.id == categoryID).SingleOrDefault();
        }
        public List<CategoryEntity> GetALLCategories()
        {
            return transaction.Category.ToList();
        }
    }

    public class TaskRepository
    {
        private readonly DatabaseTransections transaction;
        public TaskRepository(DatabaseTransections _transection) { transaction = _transection; }

        public void AddTask(TaskEntity task)
        {
            transaction.Task.Add(task);
            transaction.SaveChanges();
        }
        public void DeleteTask(TaskEntity category)
        {
            transaction.Task.Remove(category);
            transaction.SaveChanges();
        }
        public void UpdateTask(TaskEntity taskExisting, TaskEntity taskUpdated)
        {
            taskExisting.task = taskUpdated.task;
            taskExisting.dateCreated = taskUpdated.dateCreated;
            taskExisting.dateDue = taskUpdated.dateDue;
            taskExisting.priority = taskUpdated.priority;
            taskExisting.status = taskUpdated.status;
            taskExisting.categoryId = taskUpdated.categoryId;
            transaction.SaveChanges();
        }
        public TaskEntity GetTaskByID(int taskID)
        {
            return transaction.Task.Where(m => m.id == taskID).SingleOrDefault();
        }
        public List<TaskEntity> GetALLTasks(int categoryId)
        {
            return transaction.Task.Where(t => t.categoryId == categoryId).ToList();
        }
    }
}
