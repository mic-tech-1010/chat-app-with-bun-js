import { createAuthClient } from "better-auth/react"
import { backendUrl } from "./api";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: backendUrl
});