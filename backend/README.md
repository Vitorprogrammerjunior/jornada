
# Jornada Digital - Backend API

This is the backend API for the Jornada Digital application. It provides endpoints for authentication, user management, group management, submissions, and more.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

3. Create an `uploads` directory in the root of the backend folder:
   ```
   mkdir uploads
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/user` - Get current user
- `POST /api/auth/forgot-password` - Request password reset

### Users
- `GET /api/users` - Get all users (coordinator only)
- `GET /api/users/pending` - Get all pending users (coordinator only)
- `PUT /api/users/approve/:userId` - Approve a pending user (coordinator only)
- `PUT /api/users/reject/:userId` - Reject a pending user (coordinator only)
- `PUT /api/users/request-leader` - Request to be a group leader (student only)

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create a new group (leader only)
- `PUT /api/groups/:id` - Update a group (leader of the group or coordinator)
- `POST /api/groups/:id/join` - Request to join a group (student only)
- `PUT /api/groups/:groupId/members/:userId` - Approve/reject group join request (leader of the group)

### Schedule
- `GET /api/schedule` - Get journey schedule
- `PUT /api/schedule/:phaseId` - Update a phase (coordinator only)

### Submissions
- `GET /api/submissions` - Get all submissions (filtered by group for students/leaders)
- `POST /api/submissions` - Submit a new file for a phase (leader only)
- `PUT /api/submissions/:id/grade` - Grade a submission (coordinator only)

### Results
- `GET /api/results` - Get results for all groups (or filtered by user's group)
- `GET /api/results/rankings` - Get rankings of all groups
- `GET /api/results/courses` - Get rankings by course

### Settings
- `GET /api/settings` - Get all settings (coordinator only)
- `PUT /api/settings/general` - Update general settings (coordinator only)
- `PUT /api/settings/deliveries` - Update deliveries settings (coordinator only)
- `PUT /api/settings/journey` - Update journey settings (coordinator only)

## Database Connection

This template includes a placeholder for the database connection. You'll need to implement your own database connection logic. The recommended approach is to use either:

1. MySQL with a library like `mysql2`
2. MongoDB with Mongoose
3. PostgreSQL with `pg`

Example database configuration will be provided separately.
