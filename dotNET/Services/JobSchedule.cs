using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data;
using Data.Providers;
using Models;
using Models.Domain;
using Models.Domain.Schedules;
using Models.Requests.Schedules;
using Services.Interfaces;

namespace Services
{
    public class JobScheduleService : IJobScheduleService
    {
        IDataProvider _data = null;
        IUserProfileMapper _profileMapper = null;
        ILookUpService _lookUp = null;

        public JobScheduleService(IDataProvider data, IUserProfileMapper profileMapper, ILookUpService lookUp)
        {
            _data = data;
            _profileMapper = profileMapper;
            _lookUp = lookUp;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[JobSchedules_Delete_ById]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Id", id);
                },
                returnParameters: null
                );
        }

        public int Insert(JobScheduleAddRequest model, int userId)
        {
            int scheduleAvailabilityId = 0;
            string procName = "[dbo].[JobSchedules_Insert]";
            DataTable daysOfweek = null;

            if (model.DaysOfWeek != null)
            {
                daysOfweek = MapDaysOfWeek(model.DaysOfWeek);
            }
           
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    InputParamMapper(model, parameterCollection);
                    parameterCollection.AddWithValue("@DaysOfWeek", daysOfweek);
                    parameterCollection.AddWithValue("@CreatedBy", userId);
                    parameterCollection.AddWithValue("@ModifiedBy", userId);
                    parameterCollection.AddWithValue("@OrgId", model.OrgId);
                    parameterCollection.AddWithValue("@JobId", model.JobId);

                    SqlParameter idParameter = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                    idParameter.Direction = ParameterDirection.Output;
                    parameterCollection.Add(idParameter);
                },
                returnParameters: delegate (SqlParameterCollection returnParam)
                {
                    int.TryParse(returnParam["@Id"].Value.ToString(), out scheduleAvailabilityId);
                }
                );
            return scheduleAvailabilityId;
        }

        public List<JobSchedule> Current(int userId)
        {
            List<JobSchedule> list = null;
            string procName = "[dbo].[JobSchedules_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@UserId", userId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    
                    int index = 0;
                    JobSchedule schedule = MapSingleRecord(reader, ref index);

                    if(list == null)
                    {
                        list = new List<JobSchedule>();
                    }
                    list.Add(schedule);
                }
                );
            return list;
        }
        
        public List<JobSchedule> GetByOrgId(int userId, int orgId)
        {
            List<JobSchedule> list = null;
            string procName = "[dbo].[JobSchedules_Select_ByOrganization]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@UserId", userId);
                    parameterCollection.AddWithValue("@OrgId", orgId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    
                    int index = 0;
                    JobSchedule schedule = MapSingleRecord(reader, ref index);

                    if(list == null)
                    {
                        list = new List<JobSchedule>();
                    }
                    list.Add(schedule);
                }
                );
            return list;
        }
        public Paged<JobSchedule> GetAll(int pageIndex, int pageSize)
        {
            Paged<JobSchedule> schedule = null;
            List<JobSchedule> list = null;
            int totalCount = 0;
            string procName = "[dbo].[JobSchedules_SelectAll]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;

                    JobSchedule schedule = MapSingleRecord(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (list == null)
                    {
                        list = new List<JobSchedule>();
                    }
                    list.Add(schedule);
                });
            if (list != null)
            {
                schedule = new Paged<JobSchedule>(list, pageIndex, pageSize, totalCount);
            }
            return schedule;
        }

        public JobSchedule GetById(int id)
        {
            JobSchedule schedule = null;
            string procName = "[dbo].[JobSchedules_Select_ById]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;

                    schedule = MapSingleRecord(reader, ref index);
                }
                );
            return schedule;
        }

        public void Update(JobScheduleUpdateRequest model, int userId)
        {
            string procName = "[dbo].[JobSchedules_Update]";
            DataTable daysOfweek = null;

            if (model.DaysOfWeek != null)
            {
                daysOfweek = MapDaysOfWeek(model.DaysOfWeek);
            }

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    InputParamMapper(model, parameterCollection);
                    parameterCollection.AddWithValue("@ModifiedBy", userId);
                    parameterCollection.AddWithValue("@Id", model.Id);
                    parameterCollection.AddWithValue("@DaysOfWeek", daysOfweek);
                },
                null
                );
        }
        private static DataTable MapDaysOfWeek(List<string> daysOfWeek)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("DayOfWeek", typeof(string));

            foreach (string singleDay in daysOfWeek)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr.SetField(startingIndex++, singleDay);
                dt.Rows.Add(dr);
            }
            return dt;
        }

        private static void InputParamMapper(JobScheduleAddRequest model, SqlParameterCollection parameterCollection)
        {
            parameterCollection.AddWithValue("@StartDate", model.StartDate);
            parameterCollection.AddWithValue("@EndDate", model.EndDate);
            parameterCollection.AddWithValue("@DailyStartTime", model.DailyStartTime);
            parameterCollection.AddWithValue("@DailyEndTime", model.DailyEndTime);

        }

        private JobSchedule MapSingleRecord(IDataReader reader, ref int index)
        {
            JobSchedule schedule = new JobSchedule();

            schedule.Id = reader.GetSafeInt32(index++);
            schedule.ScheduleId = reader.GetSafeInt32(index++);
            schedule.StartDate = reader.GetSafeDateTime(index++);
            schedule.EndDate = reader.GetSafeDateTime(index++);
            schedule.DailyStartTime = reader.GetSafeTimeSpan(index++);
            schedule.DailyEndTime = reader.GetSafeTimeSpan(index++);
            schedule.DaysOfWeek = reader.DeserializeObject <List<LookUp>>(index++);
            schedule.DateCreated = reader.GetSafeDateTime(index++);
            schedule.DateModified = reader.GetSafeDateTime(index++);
            schedule.CreatedBy = _profileMapper.Map(reader, ref index);
            schedule.ModifiedBy = _profileMapper.Map(reader, ref index);
            schedule.JobId = reader.GetSafeInt32(index++);
            schedule.JobName = reader.GetSafeString(index++);
            schedule.JobIsActive = reader.GetSafeBool(index++);
            schedule.OrganizationId = reader.GetSafeInt32(index++);
            schedule.OrganizationName = reader.GetSafeString(index++);
            return schedule;
        }
    }
}

