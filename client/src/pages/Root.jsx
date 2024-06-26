import { Outlet, useLoaderData } from "react-router-dom";
import { Nav } from "../components/";
import { useEffect } from "react";
import { API } from "../api_instance";
import { PreviousNext } from "../components/PreviousNext";
import { Loader } from "../components/Loader";
import { useApp } from "../contexts/AppContext";
import { toast } from "react-hot-toast";
import { Scroll } from "../components/Scroll";
import { handleClosing } from "../utils/client";

export function Root() {
  const { id, upload_preset } = useLoaderData();
  const { client } = useApp();

  useEffect(() => {
    client.set({
      upload_preset,
    });
  }, [client.upload_preset]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleClosing(id));

    API.session
      .connect({
        clientId: id,
      })
      .then(({ data }) => {
        toast.success(data.online);
      })
      .catch(({ response, ...err }) => {
        if (response) {
          if (response.status === 409) toast.error(response.data.msg);
        } else {
          toast.error(err.message);
        }
      });

    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  return (
    <div className="bg-main min-h-screen min-w-[320px]">
      <Nav />
      <PreviousNext />
      <Outlet />
      <Scroll />
      <Loader />
    </div>
  );
}
