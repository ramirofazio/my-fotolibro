import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "../pages/";
import { ClientData , UploadImages} from "../pages";

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
          element: <UploadImages/>,
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
