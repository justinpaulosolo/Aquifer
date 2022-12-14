USE [CnmPro]
GO
/****** Object:  StoredProcedure [dbo].[Users_Select_AuthDataV2]    Script Date: 8/31/2022 3:09:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Justin Solo>
-- Create date: <07/08/2022>
-- Description:	<Users_Select_AuthDataV2>
-- Code Reviewer:


-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer: 
-- Note: 
-- =============================================

ALTER PROC [dbo].[Users_Select_AuthDataV2]
	@Email nvarchar(100)

AS

/* ----- TEST CODE -----

	DECLARE @Email nvarchar(100) = 'testuser7000@gmail.com'
	
	EXECUTE dbo.Users_Select_AuthDataV2 @Email

*/ ----- END TEST CODE -----


Declare @status INT
		,@confirm BIT
SELECT @status = U.UserStatusId
		,@confirm = U.IsConfirmed
FROM dbo.Users as U
WHERE @Email = Email

BEGIN
	IF @confirm = 1
		IF @status < 2
			SELECT [U].[Id]
				  ,[U].[Email]
				  ,[U].[Password]
				  ,R.[Name]
				  ,U.IsConfirmed
			  FROM [dbo].[Users] AS U
				   INNER JOIN
				   dbo.UserRoles AS UR
				   ON U.Id = UR.UserId
				   INNER JOIN
				   dbo.Roles AS R
				   ON UR.RoleId = R.Id

			  WHERE [U].[Email] = @Email
		ELSE
			  THROW 60001, 'User is not active.', 16
	ELSE
		THROW 60002, 'User is not confirmed.', 16
END

