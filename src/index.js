import React from "react";
import { createRoot } from "react-dom/client";
import ContextProviders from "./context";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./app.scss";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Router>
    <ContextProviders>
      <App />
    </ContextProviders>
  </Router>
);
