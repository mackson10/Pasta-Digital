import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

api.defaults.headers["x-auth-token"] = localStorage.token;
export default api;
