import { Outlet, useLoaderData } from "react-router-dom";
import { Nav } from "../components/";
import { UrlInUse } from "../components/UrlInUse";
import { useEffect } from "react";
import { API } from "../api_instance";
import { PreviousNext } from "../components/PreviousNext";
import { SuccessPage } from "./SuccessPage";
import { Loader } from "../components/Loader";
import { useApp } from "../contexts/AppContext";

export function Root() {
  const { id, active_link, online, upload_preset } = useLoaderData();
  const { client } = useApp();

  useEffect(() => {
    window.addEventListener("beforeunload", () => API.disconnectClient(id));
    client.set({
      upload_preset,
    });

    console.log(client.upload_preset);
    
    return () => {
      window.removeEventListener("beforeunload", () =>
        API.disconnectClient(id)
      );
    };
  }, [client.upload_preset]);

  if (!active_link) {
    return <SuccessPage />;
  }

  if (false) return <UrlInUse />;

  return (
    <div className="bg-main min-h-screen">
      <>
        <Nav />
        <PreviousNext />
        <Outlet />
        <Loader />
      </>
    </div>
  );
}
