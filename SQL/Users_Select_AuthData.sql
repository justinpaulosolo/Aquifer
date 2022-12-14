USE [CnmPro]
GO
/****** Object:  StoredProcedure [dbo].[Users_Select_AuthData]    Script Date: 8/31/2022 3:09:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Justin Solo>
-- Create date: <07/08/2022>
-- Description:	<Users_Select_AuthData>
-- Code Reviewer:


-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer: 
-- Note: 
-- =============================================
ALTER PROC [dbo].[Users_Select_AuthData]
	@Email nvarchar(100)

AS

/* ----- TEST CODE -----

	DECLARE @Email nvarchar(100) = 'testinguser1@gmail.com'
	
	EXECUTE dbo.Users_Select_AuthData @Email

*/ ----- END TEST CODE -----

BEGIN

	SELECT [U].[Id]
		  ,[U].[Email]
		  ,[U].[Password]
		  ,R.[Name]
	  FROM [dbo].[Users] AS U
		   INNER JOIN
		   dbo.UserRoles AS UR
		   ON U.Id = UR.UserId
		   INNER JOIN
		   dbo.Roles AS R
		   ON UR.RoleId = R.Id
			
	  WHERE [U].[Email] = @Email

END