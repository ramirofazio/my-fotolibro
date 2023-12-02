import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root, AdminRoot } from "../pages/";
import { ClientData, UploadImages, Clients, Folders } from "../pages";
import { RouterError } from "../components/RouterError";
import { API } from "../api_instance";
import { verifyClient, connectClient } from "./loaders";
import { SortImages } from "../pages/sort_images/sort_images";
import { CreateClient } from "../pages/admin_clients/CreateClient";
import { UpdateClient } from "../pages/admin_clients/UpdateClient";

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
          loader: connectClient,
          errorElement: <RouterError />,
          element: <ClientData />,
        },
        {
          path: "/client/:clientId/upload_images",
          element: <UploadImages />,
        },
        {
          path: "/client/:clientId/sort_images",
          loader: async ({ params }) => {
            const {photos} = (await API.getPreviusImgs(params.clientId)).data;
            const { canFinish } = (await API.canFinish(params.clientId)).data;
            
            return { photos, canFinish};
            
          },
          element: <SortImages />,
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
            const clients = await API.getClients();
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
            const books = await API.getClients();
            return books.data;
          },
          element: <Folders />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
