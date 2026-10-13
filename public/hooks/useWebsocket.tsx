import { useCallback, useEffect, useRef } from "react"
import { backendUrl } from "../lib/api";

export const UseWebsocket = () => {

    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {

        const wsUrl = backendUrl.replace(/^http/, "ws");
        const socket = new WebSocket(`${wsUrl}/ws`);

        //store the socket in the ref
        socketRef.current = socket;

        //event Listeners
        socket.onopen = () => {
            console.log('webSocket connected sucessfully')
        }

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
            } catch (error) {
                console.error(`Error parsing message: ${error}`);
            }
        }

        socket.onerror = (error) => {
            console.error(`websocket Error: ${error}`)
        }

        socket.onclose = () => {
            console.log('Websocket connection closed');
        }

        //clean up function
        return () => {
            socket.close();
        }

    }, []);

    const sendMessage = useCallback((data: string | object) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const message = typeof data === 'object' ? JSON.stringify(data) : data;
            socketRef.current.send(message);
        }
        else {
            console.warn('Websocket is not open. Message not sent.')
        }
    }, []);

    return { sendMessage };
}