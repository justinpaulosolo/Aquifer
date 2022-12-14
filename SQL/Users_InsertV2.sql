USE [CnmPro]
GO
/****** Object:  StoredProcedure [dbo].[Users_InsertV2]    Script Date: 8/31/2022 3:09:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Justin Solo>
-- Create date: <07/06/2022>
-- Description: <User_InsertV2>
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================


ALTER PROC [dbo].[Users_InsertV2]
								@Email nvarchar(100)
								,@Password nvarchar(100)
								,@IsConfirmed bit
								,@UserStatusId int
								,@RoleId int
								,@Id int OUTPUT

AS

/* ----- TEST CODE -----

	DECLARE @Id int = 1

	DECLARE @Email nvarchar(100) = 'yawilep863@otodir.com'
			,@Password nvarchar(100) = 'CnmProTestUser1!'
			,@IsConfirmed bit = 1
			,@UserStatusId int = 1
			,@Role int = 1

	EXECUTE dbo.Users_InsertV2 @Email
								,@Password
								,@IsConfirmed
								,@UserStatusId
								,@Role
								,@Id OUTPUT


								select * from dbo.Users


*/ ----- END TEST CODE -----

BEGIN

	IF NOT EXISTS (select * FROM dbo.Users AS U
					WHERE U.Email = @Email)

	INSERT INTO [dbo].[Users]
			   ([Email]
			   ,[Password]
			   ,[IsConfirmed]
			   ,[UserStatusId])
		 VALUES
			   (@Email
			   ,@Password
			   ,@IsConfirmed
			   ,@UserStatusId)
		SET		@Id = SCOPE_IDENTITY()

	EXECUTE Dbo.UserRoles_Insert @Id, @RoleId

END
