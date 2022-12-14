USE [CnmPro]
GO
/****** Object:  StoredProcedure [dbo].[Users_Insert]    Script Date: 8/31/2022 3:07:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Justin Solo>
-- Create date: <07/01/2022>
-- Description: <User_Insert>
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================


ALTER PROC [dbo].[Users_Insert]
	@Email nvarchar(100)
	,@Password nvarchar(100)
	,@IsConfirmed bit
	,@UserStatusId int
	,@Id int OUTPUT

AS

/* ----- TEST CODE -----

	DECLARE @Id int = 1
	
	DECLARE @Email nvarchar(100) = 'test@testuser.com'
			,@Password nvarchar(100) = 'testuser'
			,@IsConfirmed bit = 1
			,@UserStatusId int = 1

	EXECUTE dbo.Users_Insert @Email
							,@Password
							,@IsConfirmed
							,@UserStatusId
							,@Id

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

END



