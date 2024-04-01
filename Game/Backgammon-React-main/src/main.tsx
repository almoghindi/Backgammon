import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./state/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <Toaster />
    <Router>
      <Routes>
        <Route path="/" element={<h1>Not found</h1>} />
        <Route path="/game/:users" element={<App />} />
      </Routes>
    </Router>
  </Provider>
);
