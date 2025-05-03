import { io } from "socket.io-client";

const socket = io("https://eventflow-1wso.onrender.com");
// const socket = io("https://eventflow-1wso.onrender.com");

export default socket;
