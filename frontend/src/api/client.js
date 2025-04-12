import axios from "axios";

let serverUrl = "";
// // Si utilisation d'un environnement de production
if (process.env.NODE_ENV === "production") {
  serverUrl = process.env.REACT_APP_SERVER_URL;
} else {
  // Serveur en local
  serverUrl = "http://localhost:3010";
}

const client = axios.create({
  baseURL: serverUrl,
});

export default client;
