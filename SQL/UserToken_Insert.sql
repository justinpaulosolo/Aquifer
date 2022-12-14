USE [CnmPro]
GO
/****** Object:  StoredProcedure [dbo].[UserTokens_Insert]    Script Date: 8/31/2022 3:11:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Justin Solo>
-- Create date: <07/05/2022>
-- Description: <UserTokens_Insert>
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

ALTER PROC [dbo].[UserTokens_Insert]
	@Token varchar(200)
	,@UserId int
    ,@TokenType int

AS

/* ----- TEST CODE -----

	DECLARE	@Token varchar(200) = 'testtoken'
			,@UserId int = 1
			,@TokenType int = 1

	EXECUTE dbo.UserTokens_Insert @Token
								  ,@UserId
								  ,@TokenType

*/ ----- END TEST CODE -----

BEGIN

INSERT INTO [dbo].[UserTokens]
           ([Token]
           ,[UserId]
           ,[TokenType])
     VALUES
           (@Token
           ,@UserId
           ,@TokenType)

END


