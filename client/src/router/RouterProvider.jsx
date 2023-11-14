import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root, AdminRoot } from "../pages/";
import { ClientData, UploadImages, Clients, Folders } from "../pages";
import { RouterError } from "../components/RouterError";
import { API } from "../api_instance";
import { verifyClient } from "./loaders";
import { ShortImages } from "../pages/sort_images/images";
import { CreateClient } from "../pages/admin_clients/CreateClient";
import { UpdateClient } from "../pages/admin_clients/UpdateClient";

export function Routes() {
  const routes = createBrowserRouter([
    {
      path: "/client/:clientId",
      element: <Root />,
      errorElement: <RouterError />,
      children: [
        {
          path: "/client/:clientId/client_data",
          loader: verifyClient,
          errorElement: <RouterError />,
          element: <ClientData />,
        },
        {
          path: "/client/:clientId/upload_images",
          element: <UploadImages />,
        },
        {
          path: "/client/:clientId/sort_images",
          element: <ShortImages />,
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
      errorElement: <RouterError />,
      children: [
        {
          path: "/admin/:adminId/clients",
          loader: async () => {
            const clients = await API.getClients();
            return clients.data;
          },
          element: <Clients />,
          children: [
            {
              path: "/admin/:adminId/clients/create",
              index: true,
              element: <CreateClient/>
            },
            {
              path: "/admin/:adminId/clients/update/:clientId",
              loader: async ({params}) => {
                const clients = await API.getCLientById(params.clientId);
                console.log(clients)
                return clients.data;
              },
              element: <UpdateClient/>
            },
          ],
        },
        {
          path: "/admin/:adminId/folders",
          loader: async () => {
            const books = await API.getClients()
            return books.data
          },
          element: <Folders />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
