const BACKEND_URL = window.__ENV__
    ? window.__ENV__.BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
export default BACKEND_URL;
