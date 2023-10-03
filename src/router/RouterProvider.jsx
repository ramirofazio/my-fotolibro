import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root, ClientData } from "../pages/";

export function Routes() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/client_data",
          element: <ClientData/>,
        },
        {
          path: "/upload_images",
          element: <div>soy el upload_images</div>,
        },
        {
          path: "/sort_images",
          element: <div>sort_images</div>,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
