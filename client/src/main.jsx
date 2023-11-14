import "./index.css";
import ReactDOM from "react-dom/client";
import { Routes } from "./router/RouterProvider";
import { AppProvider } from "./contexts/AppContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <Routes />
  </AppProvider>
);
