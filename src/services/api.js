import axios from "axios";

export const api = axios.create({
    baseURL: "https://notesmanagerapi.onrender.com"
});
