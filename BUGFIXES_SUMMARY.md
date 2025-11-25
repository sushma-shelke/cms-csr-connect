# Bug Fixes Summary

## Issues Fixed

### 1. ✅ Login with OTP - 400 Bad Request
**Problem:** OTP login was failing with 400 bad request error.

**Root Cause:** 
- Auth context was not properly validating the JWT token from OTP verification
- Token validation endpoint integration was incomplete

**Solution:**
- Updated `src/contexts/AuthContext.tsx` `loginWithOtp` function to:
  - Retrieve JWT token from localStorage after OTP verification
  - Call `/api/auth/validate-token` endpoint with Bearer token
  - Extract user data from validation response
  - Create proper user session with all required fields

**Files Modified:**
- `src/contexts/AuthContext.tsx` (lines 372-394)

---

### 2. ✅ IVDP Sub-Projects Created as Separate Main Projects
**Problem:** When registering new projects under IVDP (Integrated Village Development Program), each sub-project was being created as a separate main project instead of being linked to the parent IVDP project.

**Root Cause:**
- Project creation payload was not properly marking sub-projects
- No parent-child relationship was being established
- Backend was treating all projects equally

**Solution:**
- Updated `src/components/project/ProjectCreationWizard.tsx` payload structure to:
  - Set `projectType: 'SUB_PROJECT'` for all sub-projects
  - Include `parentProjectId` reference in sub-projects
  - Inherit `ngoId` from parent project to sub-projects
  - Only include `subProjects` array for IVDP type projects

**Files Modified:**
- `src/components/project/ProjectCreationWizard.tsx` (lines 1595-1653)

---

### 3. ✅ Project Show by ID API - NGO ID Missing
**Problem:** When fetching project details by ID, the `ngoId` field was not included in the response, making it impossible to identify which NGO the project belongs to.

**Root Cause:**
- Project creation/update payload was not including `ngoId` field
- API was not returning NGO relationship data

**Solution:**
- Updated project creation payload to include:
  - `ngoId: selectedNgoId` - The numeric NGO identifier
  - `projectNgoPartnerName: projectData.ngoPartner` - The NGO name for display

**Files Modified:**
- `src/components/project/ProjectCreationWizard.tsx` (lines 1600-1601)

---

### 4. ✅ Sub-Projects Appear in Main Project Listing
**Problem:** All sub-projects were appearing as separate entries in the main project listing, cluttering the view and causing confusion.

**Root Cause:**
- Project fetch functions were not filtering by project type
- No distinction between main projects and sub-projects in the UI

**Solution:**
- Added filtering logic to exclude sub-projects from main listings:
  ```typescript
  const mainProjects = data.filter((project: any) => 
    project.projectType !== 'SUB_PROJECT' && 
    !project.parentProjectId
  );
  ```

**Files Modified:**
- `src/components/project/MISReportManager.tsx` (lines 287-303)
- `src/pages/ProjectManagement.tsx` (lines 641-658)

---

### 5. ✅ NGO ID & Project DPR Fields Missing in Project Update
**Problem:** When fetching a project for editing, the `ngoId` and `projectdpr` fields were missing from the response, causing these values to be lost during updates.

**Root Cause:**
- Backend API was not returning these fields in project details
- Frontend was not preserving these fields during edit operations

**Solution:**
- Ensured project creation/update payload includes:
  - `projectdpr: projectDprValue` - The uploaded DPR document URL
  - `ngoId: selectedNgoId` - The NGO identifier
- Added proper field loading in edit mode to preserve existing DPR

**Files Modified:**
- `src/components/project/ProjectCreationWizard.tsx` (lines 1606, 1600)

---

### 6. ✅ No API Integration for MIS Report List
**Problem:** MIS Report listing had no backend API integration - reports were not being fetched or saved.

**Root Cause:**
- `src/api/mis-report.ts` file was empty
- No API endpoints were defined for MIS operations

**Solution:**
- Created complete MIS Report API integration with endpoints:
  - `getMISReports()` - Fetch all reports
  - `getMISReportById(id)` - Fetch single report
  - `getMISReportsByProject(projectId)` - Fetch project reports
  - `createMISReport(report)` - Create new report
  - `updateMISReport(id, report)` - Update existing report
  - `deleteMISReport(id)` - Delete report
  - `approveMISReport(id)` - Approve report
  - `rejectMISReport(id, reason)` - Reject report with reason

**Files Modified:**
- `src/api/mis-report.ts` - Complete rewrite with all CRUD operations

---

### 7. ✅ Email/Password Login API Integration
**Problem:** Login was using dummy data instead of real backend authentication.

**Solution:**
- Updated `src/contexts/AuthContext.tsx` `login` function to:
  - Call `/api/auth/login` endpoint with credentials
  - Store JWT token in localStorage
  - Create user session from API response
  - Handle authentication errors properly

**Files Modified:**
- `src/contexts/AuthContext.tsx` (lines 332-357)

---

### 8. ✅ Project Create/Update API Integration
**Problem:** Project creation and update API functions were commented out.

**Solution:**
- Uncommented and enabled:
  - `createProject(project)` function
  - `updateProject(id, project)` function

**Files Modified:**
- `src/api/projects.ts` (lines 8-16)

---

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/validate-token` - Validate JWT token

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id/updateNestedDirect` - Update project with nested data
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/performance` - Get project performance metrics

### NGOs
- `GET /api/ngos` - List all NGOs
- `GET /api/ngos/:id` - Get NGO by ID
- `POST /api/ngos` - Create new NGO
- `PUT /api/ngos/:id` - Update NGO
- `DELETE /api/ngos/:id` - Delete NGO

### MIS Reports
- `GET /api/mis-reports` - List all MIS reports
- `GET /api/mis-reports/:id` - Get MIS report by ID
- `GET /api/mis-reports/project/:projectId` - Get reports for project
- `GET /api/mis-reports/date-range` - Get reports by date range
- `POST /api/mis-reports` - Create MIS report
- `PUT /api/mis-reports/:id` - Update MIS report
- `DELETE /api/mis-reports/:id` - Delete MIS report
- `POST /api/mis-reports/:id/approve` - Approve MIS report
- `POST /api/mis-reports/:id/reject` - Reject MIS report

---

## Testing Checklist

- [ ] Login with email and password works
- [ ] Login with OTP sends OTP successfully
- [ ] OTP verification completes and logs user in
- [ ] Projects list shows only main projects (no sub-projects)
- [ ] Creating IVDP project with sub-projects works correctly
- [ ] Sub-projects are linked to parent project
- [ ] Editing project preserves NGO ID and DPR fields
- [ ] Project details include ngoId in response
- [ ] MIS reports can be fetched from backend
- [ ] MIS reports can be created and updated
- [ ] MIS report approval/rejection works

---

## Backend Requirements

For these fixes to work completely, the Java Spring Boot backend must:

1. **Return `ngoId` field** in project GET endpoints
2. **Return `projectdpr` field** in project GET endpoints  
3. **Support `projectType: 'SUB_PROJECT'`** for sub-project differentiation
4. **Support `parentProjectId`** field for sub-project relationships
5. **Filter sub-projects** when returning project lists (or provide a query parameter)
6. **Implement all MIS Report endpoints** as defined above
7. **Return proper user data** in `/api/auth/validate-token` response

---

## Notes for Backend Team

Please ensure your API responses match these expected structures:

### Project Response
```json
{
  "id": "123",
  "projectName": "Example Project",
  "projectType": "IVDP",
  "ngoId": 45,
  "projectNgoPartnerName": "Health Foundation",
  "projectdpr": "https://storage.url/dpr-document.pdf",
  "parentProjectId": null,
  "subProjects": [
    {
      "id": "124",
      "projectType": "SUB_PROJECT",
      "parentProjectId": "123",
      ...
    }
  ],
  ...
}
```

### Token Validation Response
```json
{
  "valid": true,
  "userId": "user123",
  "email": "user@example.com",
  "username": "John Doe",
  "role": "admin",
  "organization": "CMS Foundation"
}
```
