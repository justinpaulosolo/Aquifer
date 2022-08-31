using Microsoft.Extensions.Options;
using Data;
using Data.Providers;
using Models;
using Models.AppSettings;
using Models.Domain;
using Models.Domain.User;
using Models.Requests;
using Models.Requests.Email;
using Models.Requests.User;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace Services
{
    public class UserService : IUserService
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;
        private AppKeys _appKeys;

        public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider, IOptions<AppKeys> appKeys)
        {
            _authenticationService = authSerice;
            _dataProvider = dataProvider;
            _appKeys = appKeys.Value;
        }

        public async Task<bool> CheckVerification(TwoFactorAuthenticationRequest model)
        {
            bool isSuccessful = false;
            string accountSid = _appKeys.TwilioAccountSid;
            string authToken = _appKeys.TwilioAuthToken;
            TwilioClient.Init(accountSid, authToken);
            VerificationCheckResource verificationCheck = VerificationCheckResource.Create(
                to: model.PhoneNumber,
                code: model.Token,
                pathServiceSid: "VAf3da05dba32dfa7e9a9f050bfe2793ba"
            );
            if (verificationCheck.Status == "approved")
            {
                IUserAuthData response = Get(model.Email, model.Password);
                if(response != null)
                {
                    await _authenticationService.LogInAsync(response);
                    isSuccessful = true;
                }
            }

            return isSuccessful;
        }


        public VerificationResource SendVerification(string phoneNumber)
        {
            string accountSid = _appKeys.TwilioAccountSid;
            string authToken = _appKeys.TwilioAuthToken;
            TwilioClient.Init(accountSid, authToken);
            var verificationCheck = VerificationResource.Create(
                to: phoneNumber,
                channel: "sms",
                pathServiceSid: "VAf3da05dba32dfa7e9a9f050bfe2793ba"
            );
            return verificationCheck;
        }
        
        public bool LogInAsync(string email, string password)
        {
            bool isSuccessful = false;

            IUserAuthData response = Get(email, password);

            if (response != null)
            {
                isSuccessful = true;
            }

            return isSuccessful;
        }

        public async Task<bool> LogInTest(string email, string password, int id, string[] roles = null)
        {
            bool isSuccessful = false;
            var testRoles = new[] { "User", "Super", "Content Manager" };

            var allRoles = roles == null ? testRoles : testRoles.Concat(roles);

            IUserAuthData response = new UserBase
            {
                Id = id
                ,
                Name = email
                ,
                Roles = allRoles
                ,
                TenantId = "Aquifer"
            };

            Claim fullName = new Claim("CustomClaim", "Aquifer");
            await _authenticationService.LogInAsync(response, new Claim[] { fullName });

            return isSuccessful;
        }

        public int Create(UserAddRequest userModel)
        {
            int userId = 0;
            string password = userModel.Password;
            string salt = BCrypt.BCryptHelper.GenerateSalt();
            string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);

            string procName = "[dbo].[Users_InsertV2]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@Email", userModel.Email);
                    paramCol.AddWithValue("@Password", hashedPassword);
                    paramCol.AddWithValue("@IsConfirmed", false);
                    paramCol.AddWithValue("@UserStatusId", 1);
                    paramCol.AddWithValue("@RoleId", 1);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    paramCol.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCol)
                {
                    object oId = returnCol["@Id"].Value;

                    Int32.TryParse(oId.ToString(), out userId);
                });

            return userId;
        }

        public void UpdatePassword(UserUpdatePasswordRequest model)
        {
            string password = model.Password;
            string salt = BCrypt.BCryptHelper.GenerateSalt();
            string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt); //hash password here

            string procName = "[dbo].[Users_Update]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@Email", model.Email);
                    col.AddWithValue("@Password", hashedPassword);
                    col.AddWithValue("@IsConfirmed", true);
                    col.AddWithValue("@UserStatusId", 1);

                },
                returnParameters: null);
        }

        public void ConfirmUser(string token)
        {
            string procName = "[dbo].[Users_UpdateIsConfirm]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@Token", token);
                },
                returnParameters: null
                );
        }

        public void InsertToken(string token, int userId, int tokenType)
        {

            string procName = "[dbo].[UserTokens_Insert]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@Token", token);
                    paramCol.AddWithValue("@UserId", userId);
                    paramCol.AddWithValue("@TokenType", tokenType);
                },
                returnParameters: null);
        }

        public bool VerifyEmail(string email)
        {
            string procName = "[dbo].[Users_Select_ByEmail]";
            bool isUser = false;

            User user = new User();
            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@email", email);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                user.Id = reader.GetInt32(startingIndex++);
                user.Email = reader.GetSafeString(startingIndex++);

                if (!string.IsNullOrEmpty(email) && user.Email == email)
                {
                    isUser = true;
                }

            });
             return isUser;
        }

        public int GetByEmail(string email)
        {
            string procName = "[dbo].[Users_Select_AuthDataV2]";
            string passwordFromDb = "";

            UserBase user = null;
            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Email", email);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
               UserBase aUser = new UserBase();
                aUser.Id = reader.GetSafeInt32(0);
                aUser.Name = reader.GetSafeString(1);
                passwordFromDb = reader.GetSafeString(2);
                aUser.Roles = new[] { reader.GetSafeString(3) };
                aUser.TenantId = "CnmPro";
                user = aUser;
            });
            return user.Id;
        }

        public UserV2 HasProfile (int userId, UserBase user)
        {
            string procName = "[dbo].[Users_Current]";

            UserV2 aUser = null;
            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                UserV2 userV2 = new UserV2();
                userV2.hasProfile = reader.GetSafeBool(0);
                userV2.Id = user.Id;
                userV2.Name = user.Name;
                userV2.Roles = user.Roles;
                userV2.TenantId = user.TenantId;

                aUser = userV2;
            });

            return aUser;

        }

        private IUserAuthData Get(string email, string password)
        {
            string passwordFromDb = "";
            UserBase user = null;

            string procName = "[dbo].[Users_Select_AuthDataV2]";

            _dataProvider.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@Email", email);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    UserBase aUser = new UserBase();
                    aUser.Id = reader.GetSafeInt32(0);
                    aUser.Name = reader.GetSafeString(1);
                    passwordFromDb = reader.GetSafeString(2);
                    aUser.Roles = new[] {reader.GetSafeString(3)};
                    aUser.TenantId = "CnmPro";
 
                    bool isValidCredentials = BCrypt.BCryptHelper.CheckPassword(password, passwordFromDb);

                    if (isValidCredentials)
                    {
                        user = aUser;
                    }
                }
                );
     
            return user;
        }
        private static User MapSingleUser(IDataReader reader)
        {
            User user = new User();
            int index = 0;
            user.Id = reader.GetSafeInt32(index++);
            user.Email = reader.GetSafeString(index++);
            user.Roles = new[] {reader.GetSafeString(index++)};
            user.TenantId = "CnmPro";

            return user;
        }

        public void DeleteToken(string token)
        {
            string procName = "[dbo].[UserTokens_Delete_ByToken]";

            _dataProvider.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Token", token);
            });
        }

    }
}