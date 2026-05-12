import { io } from "socket.io-client";

// Backend server URL
const SOCKET_URL = "http://localhost:5000";

// Socket connection
const socket = io(SOCKET_URL);

export default socket;
