// import React, { useEffect, useState } from "react";
// import socket from "../socket";

// const Chat = () => {
//   const [username, setUsername] = useState("");
//   const [room, setRoom] = useState("global");
//   const [joined, setJoined] = useState(false);

//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [typingUser, setTypingUser] = useState("");
  

//   // Join room
//   const joinRoom = () => {
//     if (username.trim() !== "") {
//       socket.emit("join_room", room);
//       setJoined(true);
//     }
//   };

//   // Send message
//   const sendMessage = () => {
//     if (message.trim() !== "") {
//       const messageData = {
//         room,
//         author: username,
//         message,
//         time: new Date().toLocaleTimeString(),
//       };

//       socket.emit("send_message", messageData);
//       setMessages((prev) => [...prev, messageData]);
//       setMessage("");
//     }
//   };

//   // Typing handler
//   const handleTyping = (e) => {
//     setMessage(e.target.value);

//     socket.emit("typing", {
//       room,
//       username,
//     });
//   };

//   // Receive messages & typing
//   useEffect(() => {
//     socket.on("receive_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     socket.on("show_typing", (username) => {
//       setTypingUser(username);
//       setTimeout(() => setTypingUser(""), 2000);
//     });

//     return () => {
//       socket.off("receive_message");
//       socket.off("show_typing");
//     };
//   }, []);

//   // ---------------- UI ----------------

//   if (!joined) {
//     return (
//       <div style={{ marginTop: "100px", textAlign: "center" }}>
//         <h2>Join Chat</h2>
//         <input
//           placeholder="Enter your name"
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <br /><br />
//         <button onClick={joinRoom}>Join</button>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <h3>Room: {room}</h3>
//       </div>

//       <div className="chat-body">
//         {messages.map((msg, index) => (
//           <div className="message" key={index}>
//             <strong>{msg.author}</strong>: {msg.message}
//           </div>
//         ))}
//       </div>

//       {typingUser && (
//         <p className="typing" style={{ fontStyle: "italic", color: "gray" }}>
//           {typingUser} is typing...
//         </p>
//       )}

//       <div className="chat-footer">
//         <input
//           placeholder="Type a message..."
//           value={message}
//           onChange={handleTyping}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };  

// export default Chat;


import React, { useEffect, useState } from "react";
import socket from "../socket";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("global");
  const [joined, setJoined] = useState(false);
  const [password ,setPassword]=useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  // ✅ ADD: online users
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ✅ ADD: emojis
  const emojis = ["😀", "😂", "😍", "😢", "🔥", "👍"];

  // Join room
  const joinRoom = () => {
    if (username.trim() !== "") {
      socket.emit("join_room", room);

      // ✅ ADD: inform server about user
      socket.emit("user_joined", { room, username });

      setJoined(true);
    }
  };

  // Send message
  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage("");
    }
  };

  // Typing handler
  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", {
      room,
      username,
    });
  };

  // Receive messages, typing & online users
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("show_typing", (username) => {
      setTypingUser(username);
      setTimeout(() => setTypingUser(""), 2000);
    });

    // ✅ ADD: online users listener
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("show_typing");
      socket.off("online_users");
    };
  }, []);

  // ---------------- UI ----------------

  if (!joined) {
    return (
      <div style={{ marginTop: "100px", textAlign: "center" }}>
        <h2>Join Chat</h2>
        <input
          placeholder="Enter your name"
          onChange={(e) => setUsername(e.target.value)}
        /><br></br>
        <input 
        placeholder="Enter password"
        onChange={(e)=> setPassword(e.target.value)}
        />
        <br /><br />
        <button onClick={joinRoom}>Join</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Room: {room}</h3>
      </div>

      {/* ✅ ADD: ONLINE USERS */}
      <div style={{ marginBottom: "10px" }}>
        <strong>Online:</strong>{" "}
        {onlineUsers.map((user, index) => (
          <span key={index} style={{ marginRight: "8px" }}>
            🟢 {user}
          </span>
        ))}
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            <strong>{msg.author}</strong>: {msg.message}
          </div>
        ))}
      </div>

      {typingUser && (
        <p style={{ fontStyle: "italic", color: "gray" }}>
          {typingUser} is typing...
        </p>
      )}

      <div className="chat-footer">

        {/* ✅ ADD: EMOJI BAR */}
        <div className="emoji">
          {emojis.map((emoji) => (
            <button className="emoji-btn"
              key={emoji}
              onClick={() => setMessage((prev) => prev + emoji)}
              
            >
              {emoji}
            </button>
          ))}
        </div>

        <input
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
