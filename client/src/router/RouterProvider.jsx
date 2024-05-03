import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root, AdminRoot } from "../pages/";
import { ClientData, Clients, Folders } from "../pages";
import { RouterError } from "../components/RouterError";
import { API } from "../api_instance";
import { verifyClient } from "./loaders";
import { CreateClient } from "../pages/admin_clients/CreateClient";
import { UpdateClient } from "../pages/admin_clients/UpdateClient";
import { SelectImagesPage } from "../pages/upload_images";
import { SortImagesPage } from "../pages/sort_images";
import { SuccessPage } from "../components/SuccessPage";

export function Routes() {
  const routes = createBrowserRouter([
    {
      path: "/client/:clientId",
      element: <Root />,
      errorElement: <RouterError />,
      loader: verifyClient,
      children: [
        {
          path: "/client/:clientId/client_data",
          loader: async ({ params }) => {
            const client = await API.getCLientById(params.clientId);

            return client.data;
          },
          errorElement: <RouterError />,
          element: <ClientData />,
        },
        {
          path: "/client/:clientId/upload_images",
          element: <SelectImagesPage />,
        },
        {
          path: "/client/:clientId/sort_images",
          element: <SortImagesPage />,
        },
      ],
    },
    {
      path: "/admin/:adminId",
      loader: async ({ params }) => {
        const isAdmin = await API.isAdmin(params.adminId);
        return isAdmin;
      },
      element: <AdminRoot />,
      errorElement: <RouterError />,
      children: [
        {
          path: "/admin/:adminId/clients",
          loader: async () => {
            const clients = await API.getClients({
              orderBy: "created_at",
              direction: "DESC",
            });
            return clients.data;
          },
          element: <Clients />,
          children: [
            {
              path: "/admin/:adminId/clients/create",
              index: true,
              element: <CreateClient />,
            },
            {
              path: "/admin/:adminId/clients/update/:clientId",
              loader: async ({ params }) => {
                const client = await API.getCLientById(params.clientId);
                return client.data;
              },
              element: <UpdateClient />,
            },
          ],
        },
        {
          path: "/admin/:adminId/folders",
          loader: async () => {
            const folders = await API.getClients({
              orderBy: "last_link_download",
              direction: "DESC",
            });
            return folders.data;
          },
          element: <Folders />,
        },
      ],
    },
    {
      path: "/success",
      element: <SuccessPage />,
      errorElement: <RouterError />,
    },
  ]);

  return <RouterProvider router={routes} />;
}
