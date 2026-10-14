import { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) {
            setSocket(null);
            setIsConnected(false);
            return;
        }

        const token = localStorage.getItem("token");
        const rawSocketUrl = import.meta.env.VITE_SOCKET_URL ||
            (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") : "") ||
            "http://localhost:5000";
        const SOCKET_URL = rawSocketUrl.replace(/\/$/, "");

        const newSocket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => setIsConnected(true));
        newSocket.on("connect_error", (err) => console.error("Socket error:", err.message));
        newSocket.on("disconnect", () => setIsConnected(false));

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};