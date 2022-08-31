using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using Models.Domain;
using Models.Requests.Schedules;
using Services;
using Services.Interfaces;
using Web.Controllers;
using Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Web.Api.Controllers
{
    [Route("api/jobschedules")]
    [ApiController]
    public class JobScheduleApiController : BaseApiController
    {
        private IJobScheduleService _service = null;
        private IAuthenticationService<int> _authService = null;
        public JobScheduleApiController(IJobScheduleService service
            , ILogger<JobScheduleApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(JobScheduleUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<int> Create(JobScheduleAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Insert(model, userId);

                ItemResponse<int> response = new ItemResponse<int> { Item = id};

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("organization/{orgId:int}")]
        public ActionResult<ItemsResponse<JobSchedule>> GetByOrgId(int orgId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<JobSchedule> schedules = _service.GetByOrgId(userId, orgId);

                if (schedules == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not found.");
                }
                else
                {
                    response = new ItemsResponse<JobSchedule> { Items = schedules };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("createdby")]
        public ActionResult<ItemsResponse<JobSchedule>> GetCurrent()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<JobSchedule> schedules = _service.Current(userId);

                if (schedules == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not found.");
                }
                else
                {
                    response = new ItemsResponse<JobSchedule> { Items = schedules };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<JobSchedule> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                JobSchedule schedule = _service.GetById(id);
                if (schedule == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resources not found.");
                }
                else
                {
                    response = new ItemResponse<JobSchedule>() { Item = schedule };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<JobSchedule>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<JobSchedule>  schedules = _service.GetAll(pageIndex, pageSize);
                if (schedules == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<JobSchedule>> { Item = schedules };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}

