import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root, AdminRoot } from "../pages/";
import { ClientData, UploadImages, Clients, Folders } from "../pages";

export function Routes() {
  const routes = createBrowserRouter([
    {
      path: "/client/:clientId",
      loader: ({ params }) => {
        console.log(params.clientId);
        return params;
      },
      element: <Root />,
      children: [
        {
          path: "/client/:clientId/client_data",
          element: <ClientData />,
        },
        {
          path: "/client/:clientId/upload_images",
          element: <UploadImages />,
        },
        {
          path: "/client/:clientId/sort_images",
          element: <div>sort_images</div>,
        },
      ],
    },
    {
      path: "/admin/:adminId",
      loader: ({ params }) => {
        console.log(params.adminId);
        console.log("admin");
        return params;
      },
      element: <AdminRoot />,
      children: [
        {
          path: "/admin/:adminId/clients",
          element: <Clients/>,
        },
        {
          path: "/admin/:adminId/folders",
          element: <Folders/>,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
