# Simple Chat application using Chat Application

Develop a simple chat application that uses WebSockets for real-time communication. The application includes user validation and authentication to ensure secure access.
## Features
- User Registration and Authentication:

- User registration with basic details (username, password, email).
Secure storage of user credentials using hashing techniques.
Login mechanism to authenticate users before they can access the chat application.
WebSocket Setup:

- Establish WebSocket connection between the client and the server.
Ensure only authenticated users can open a WebSocket connection.
Real-time Messaging:

- Allow users to send and receive messages in real-time.
Broadcast messages to all connected users.
Message Handling:

- Display messages with timestamps and the sender’s username.
Ensure reliable transmission and reception of messages over WebSocket connections.
User Interface:

- Simple and intuitive user interface for the chat application.
Input fields for messages and a display area for chat history.

## Technology Used
- Frontend: HTML, CSS, JavaScript (React)
- Backend: Node.js, Express.js
- Database: MongoDB
- WebSockets: Socket.IO
- Authentication: JWT (JSON Web Tokens), bcrypt

## Prerequisites
- NodeJs
- MongoDB

## OutPUTS

   - welcome
     ![welcome](https://github.com/user-attachments/assets/eec51a86-99b7-4558-a106-b9f4288fa68e)

   - Register
     ![register](https://github.com/user-attachments/assets/722d6155-9af2-4e73-bf45-ffdcf9888feb)
   - setAvatar
     ![setAvatar ](https://github.com/user-attachments/assets/957a8c6a-0ee4-411f-a871-e46ed2c8a4e0)

   - Login
    ![login](https://github.com/user-attachments/assets/327c09f6-d46d-4dfe-ae0d-6b4c71756cab)
   - Dashboard
     ![Dashboard](https://github.com/user-attachments/assets/f455941a-c14d-40f1-9273-f7c5db926508)

   - Broadcast
   - ![broadcast](https://github.com/user-attachments/assets/6fde5742-1987-492e-adb6-4222c33983f9)

   - message Specific person
     ![message to specific user](https://github.com/user-attachments/assets/0c2d0eee-28b4-4e29-981e-7cb650b358fc)



    
    ## APIS
  - Authentication
      - Login(post) -http://localhost:5000/api/auth/login
      - Signup(post) -http://localhost:5000/api/auth/register
      - Logout(post) -http://localhost:5000/api/auth/logout/668f75582ebadec329e7a25b
  - Product
       - getAllUser(get) -http://localhost:5000/api/auth/allusers/668f75582ebadec329e7a25b
       - setAvatar(post) -http://localhost:5000/api/auth/setAvatar/668f75582ebadec329e7a25b
       - getmessage(post) -http://localhost:5000/api/messages/getmsg/
       - addNessage(post) -http://localhost:5000/api/messages/addmsg/
   
  - ## Postman API collectiom
    - Available in the code section




     






