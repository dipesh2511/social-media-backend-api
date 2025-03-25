# Social Media API Documentation

Develop a robust social media backend REST-API that empowers users to post, comment, like, send friend requests, and reset their passwords using OTP for enhanced security.

Implement a user authentication system with essential features like signup, login, and logout. Moreover, you have the opportunity to earn extra marks for implementing an advanced feature: the ability to log out from all devices. To achieve this, consider storing each login token in an additional array field within the user's document.

## Authentication & Security

- **JWT Authentication**: This API uses JSON Web Tokens (JWT) for secure user authentication. Upon successful login, a JWT is issued, which must be included in the headers of protected routes.
- **Logout from All Devices**: Each login token is stored in an array within the user's document, allowing users to log out from all active sessions.

## File Uploads

- **Multer for File Uploads**: The API uses Multer middleware for handling multipart/form-data, making it easy to upload images and other media files for user profiles and posts.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd social-media-backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   npm start
   ```
   or for development mode:
   ```sh
   npm run dev
   ```

## API Endpoints

### Users

- **Signup:** `POST /api/users/signup`
- **Signin:** `POST /api/users/signin`
- **Logout:** `POST /api/users/logout`
- **Logout All Devices:** `POST /api/users/logout-all-devices`
- **Get User Details:** `GET /api/users/get-details/:userId`
- **Get All Users:** `GET /api/users/get-all-details`
- **Update User Details:** `PUT /api/users/update-details/:userId`

### Posts

- **Get All Posts:** `GET /api/posts/all`
- **Get Post by ID:** `GET /api/posts/:postId`
- **Get User Posts:** `GET /api/posts/user/:userId`
- **Create Post:** `POST /api/posts`
- **Delete Post:** `DELETE /api/posts/:postId`
- **Update Post:** `PUT /api/posts/:postId`

### Comments

- **Get Comments:** `GET /api/comments/:postId`
- **Add Comment:** `POST /api/comments/:postId`
- **Delete Comment:** `DELETE /api/comments/:commentId`
- **Update Comment:** `PUT /api/comments/:commentId`

### Likes

- **Get Likes:** `GET /api/likes/:id`
- **Toggle Like:** `POST /api/likes/toggle/:id`

### Friendships

- **Get Friends:** `GET /api/friends/get-friends/:userId`
- **Get Pending Requests:** `GET /api/friends/get-pending-requests`
- **Toggle Friendship:** `POST /api/friends/toggle-friendship/:friendId`
- **Respond to Friend Request:** `POST /api/friends/response-to-request/:friendId`

### OTP

- **Send OTP:** `POST /api/otp/send`
- **Verify OTP:** `POST /api/otp/verify`
- **Reset Password:** `POST /api/otp/reset-password`

## API Documentation

The Swagger documentation is available at:

📄 **[Swagger UI](http://localhost:3000/api-docs)**

## License

This project is licensed under a proprietary license. Unauthorized distribution or modification is not permitted.

---

Feel free to contribute, report issues, or request features!

