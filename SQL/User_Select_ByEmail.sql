USE [CnmPro]
GO
/****** Object:  StoredProcedure [dbo].[Users_Select_ByEmail]    Script Date: 8/31/2022 3:10:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Justin Solo>
-- Create date: <07/01/2022>
-- Description: <Users_Select_ByEmail>
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

ALTER PROC [dbo].[Users_Select_ByEmail]
	@Email nvarchar(100)

AS

/* ----- TEST CODE -----

	DECLARE @Email nvarchar(100) = 'yeraga1270@teasya.com'
	
	EXECUTE dbo.Users_Select_ByEmail @Email

*/ ----- END TEST CODE -----

BEGIN

	SELECT [U].[Id]
		  ,[U].[Email]
		  ,[U].[Password]
		  ,[U].[IsConfirmed]
		  ,[US].[Name]
		  ,[U].[DateCreated]
		  ,[U].[DateModified]
	  FROM [dbo].[Users] AS U
		   INNER JOIN
		   [dbo].[UserStatus] AS US
		   ON [U].UserStatusId = [US].[Id]
			
	  WHERE [U].[Email] = @Email

END