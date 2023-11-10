import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root, AdminRoot } from "../pages/";
import { ClientData, UploadImages, Clients, Books } from "../pages";
import { RouterError } from "../components/RouterError";
import { API } from "../api_instance";
import { verifyClient } from "./loaders";
import { ShortImages } from '../pages/sort_images/images';

export function Routes() {
  const routes = createBrowserRouter([
    {
      path: "/client/:clientId",
      element: <Root />,
      errorElement: <RouterError/>,
      children: [
        {
          path: "/client/:clientId/client_data",
          loader: verifyClient,
          errorElement: <RouterError/>,
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
      errorElement: <RouterError/>,
      children: [
        {
          path: "/admin/:adminId/clients",
          loader: async () => {
            const clients = await API.getClients()
            return clients.data
          },
          element: <Clients />,
        },
        {
          path: "/admin/:adminId/books",
          /* loader: async () => {
            const books = await API.getBooks()
            return books.data
          }, */
          element: <Books />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
