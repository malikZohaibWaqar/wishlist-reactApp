using DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace wishlistAPI.Controllers
{
    [Route("api/wishlist")]
    public class WishlistController : ApiController
    {
        #region Category Methods (Create,Update,Delete)

        [HttpGet]
        [Route("api/wishlist/GetAllCategories")]
        public IEnumerable<CategoryEntity> GetAllCategories()
        {
            return new CategoryRepository(new DatabaseTransections()).GetALLCategories();
        }
        [HttpPost]
        [Route("api/wishlist/CreateCategory")]
        public HttpResponseMessage CreateCategory([FromBody]CategoryEntity _entity)
        {
            try
            {
                new CategoryRepository(new DatabaseTransections()).AddCategory(_entity);
                var message = Request.CreateResponse(HttpStatusCode.Created, _entity);
                return message;
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }
        [HttpPut]
        [Route("api/wishlist/UpdateCategory")]
        public HttpResponseMessage UpdateCategory([FromBody]CategoryEntity _entity)
        {
            try
            {
                var _repository = new CategoryRepository(new DatabaseTransections());
                var _existingEntity = _repository.GetCategoryByID(_entity.id);
                if (_existingEntity != null)
                {
                    _repository.UpdateCategory(_existingEntity, _entity);
                    return Request.CreateResponse(HttpStatusCode.OK, _entity);
                }
                else
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "The category with ID " + _entity.id + " not found");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex);
            }
        }
        [HttpDelete]
        [Route("api/wishlist/DeleteCategory/{id}")]
        public HttpResponseMessage DeleteCategory(int id)
        {
            try
            {
                var _repository = new CategoryRepository(new DatabaseTransections());
                var _entity = _repository.GetCategoryByID(id);
                if (_entity != null)
                {
                    _repository.DeleteCategory(_entity);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
                else
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "The category with ID " + id + " not found");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex);
            }
        }
        
        #endregion

        #region Task Methods (Create,Update,Delete)

        [HttpGet]
        [Route("api/wishlist/GetAllTask")]
        public IEnumerable<TaskEntity> GetAllTask(int categoryId)
        {
            return new TaskRepository(new DatabaseTransections()).GetALLTasks(categoryId);
        }
        [HttpPost]
        [Route("api/wishlist/CreateTask")]
        public HttpResponseMessage CreateTask([FromBody]TaskEntity _entity)
        {
            try
            {
                new TaskRepository(new DatabaseTransections()).AddTask(_entity);
                var message = Request.CreateResponse(HttpStatusCode.Created, _entity);
                return message;
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }
        [HttpPut]
        [Route("api/wishlist/UpdateTask")]
        public HttpResponseMessage UpdateTask([FromBody]TaskEntity _entity)
        {
            try
            {
                var _repository = new TaskRepository(new DatabaseTransections());
                var _existingEntity = _repository.GetTaskByID(_entity.id);
                if (_existingEntity != null)
                {
                    _repository.UpdateTask(_existingEntity, _entity);
                    return Request.CreateResponse(HttpStatusCode.OK, _entity);
                }
                else
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "The task with ID " + _entity.id + " not found");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex);
            }
        }
        [HttpDelete]
        [Route("api/wishlist/DeleteTask/{id}")]
        public HttpResponseMessage DeleteTask(int id)
        {
            try
            {
                var _repository = new TaskRepository(new DatabaseTransections());
                var _entity = _repository.GetTaskByID(id);
                if (_entity != null)
                {
                    _repository.DeleteTask(_entity);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
                else
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "The task with ID " + id + " not found");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex);
            }
        }

        #endregion
    }
}