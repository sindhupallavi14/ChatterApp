# ChatterApp 🗨️

A real-time chat application built with **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**. Users can join chat rooms, send messages, see who is online, and receive a welcome message when they join.

---

## Features

- Real-time messaging with Socket.IO
- User onboarding with username input
- Welcome message for new users
- Typing indicators
- User list showing all online users
- Message history (last 50 messages stored in MongoDB)
- Responsive design with Bootstrap
- Avatars generated dynamically from usernames

---

## Tech Stack

- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MongoDB, Mongoose

---

## How to Use

1. **Open the Application**  
   Navigate to the frontend in your browser (`http://localhost:3000` if running locally).

2. **Onboarding**  
   - You will see a welcome screen asking for your username.  
   - Enter a username and click **Join Chat** to enter the chat room.

3. **Chat Interface**  
   - Once joined, you can see the **Chat Room** interface.  
   - The **message history** (last 50 messages) from other users will be visible.  
   - You can type messages in the input box at the bottom and send them.  
   - A **typing indicator** shows when other users are typing.  

4. **Welcome Message**  
   - When you join for the first time, a **welcome message** will appear at the top-right corner of the chat for **9 seconds**.  
   - This welcome message is visible to all connected users.

5. **User List**  
   - On the right side, you can see a list of all **online users** in real-time.  

6. **Notifications**  
   - Notifications appear when users **join** or **leave** the chat.  


