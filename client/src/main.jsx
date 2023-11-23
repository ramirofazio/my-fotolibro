import "./index.css";
import ReactDOM from "react-dom/client";
import { Routes } from "./router/RouterProvider";
import { AppProvider } from "./contexts/AppContext";
import {Toaster} from "react-hot-toast"

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <Routes />
    <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2500,
          style: {
            backgroundColor: "#4e5e65",
            borderWidth: "2px",
            borderColor: "#3c005a",
            color: "white",
            fontSize: "25px"
          },
        }}
      />
  </AppProvider>
);
