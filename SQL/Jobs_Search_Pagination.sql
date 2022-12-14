USE [CnmPro]
GO
/****** Object:  StoredProcedure [dbo].[Jobs_Search_Pagination]    Script Date: 8/31/2022 3:11:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 -- =============================================
-- Author: <Justin Solo>
-- Create date: <07/18/2022>
-- Description: <Jobs_Search_Pagination>
-- Code Reviewer:

-- MODIFIED BY: <Thomas Sauer>
-- MODIFIED DATE:<07/21/2022?
-- Code Reviewer:
-- Note: Changed this proc to give back the same values as the Select_ById, SelectAll and Select_ByCreatedBy Procs 
-- ============================================= 
 ALTER PROC [dbo].[Jobs_Search_Pagination]   @PageIndex int ,@PageSize int ,@Query nvarchar(50)

		
AS
/*-----TEST CODE-----

Declare @PageIndex int = 0
		,@PageSize int = 10
		,@Query nvarchar(50) = 'civil'



EXECUTE [dbo].[Jobs_Search_Pagination ]
		@PageIndex
		,@PageSize
		,@Query

	

		EXECUTE dbo.jobs_selectall @PageIndex 
		,@PageSize

-----END TEST CODE-----
*/

BEGIN

	DECLARE 
		@offset int = @PageIndex * @PageSize

SELECT j.[Id]
			  ,j.[JobTypeId] AS [JobTypeId] 
			  ,jt.[Name] AS [JobTypeName]
			  ,j.[Title]
			  ,j.[Description]
			  ,j.[Requirements]
			  ,j.[LocationId] AS [Location]
			  ,l.[LocationTypeId] AS [LocationType]
			  ,lt.[Name] AS [LocationTypeName]
			  ,l.[LineOne]
			  ,l.[LineTwo]
			  ,l.[City]
			  ,l.[Zip]
			  ,l.[StateId] As [StateId]
			  ,s.[Name]
			  ,s.[Code]
			  ,l.[Latitude]
			  ,l.[Longitude]
			  ,j.[OrganizationId] AS [Organization]
			  ,o.[OrganizationTypeId] AS [OrganizationType] 
			  ,ot.[Name]
			  ,o.[Name]
			  ,o.[Headline]
			  ,o.[Description]
			  ,o.[Logo]
			  ,o.[Phone]
			  ,o.[SiteUrl]
			  ,up.[Id]
			  ,j.[CreatedBy]
			  ,up.FirstName
			  ,up.LastName
			  ,up.Mi
			  ,up.AvatarUrl
			  ,j.[DateCreated]
			  ,j.[DateModified]
			  ,TotalCount = COUNT(1) OVER()


			  
from dbo.Jobs as j
left outer join dbo.Organizations as o on o.Id = j.OrganizationId
left outer join dbo.Locations as l on l.id = j.LocationId
inner join dbo.JobTypes as jt on jt.Id = j.JobTypeId
left outer join dbo.LocationTypes as lt on lt.Id = l.LocationTypeId
left outer join dbo.OrganizationTypes as ot on ot.Id = o.OrganizationTypeId
left outer join dbo.UserProfiles as up on up.UserId = j.CreatedBy
left outer join dbo.States as s on s.Id = l.StateId

	WHERE	j.Title LIKE  '%' + @Query + '%'
		OR  j.Description LIKE '%' + @Query + '%'
		OR  j.Requirements LIKE '%' + @Query + '%'
		OR  l.Zip LIKE '%' + @Query + '%'
		OR  l.City LIKE '%' + @Query + '%'

	ORDER BY j.Id

	OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY

END