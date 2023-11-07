import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from '../pages/';
import { ClientData, UploadImages } from '../pages';
import { ShortImages } from '../pages/sort_images/images';

export function Routes() {
  const routes = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/client_data',
          element: <ClientData />,
        },
        {
          path: '/upload_images',
          element: <UploadImages />,
        },
        {
          path: '/sort_images',
          element: <ShortImages />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
