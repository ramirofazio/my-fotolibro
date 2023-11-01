import { Outlet } from "react-router-dom";
import { Nav } from "../components/";

export function Root() {
  return (
    <div className="bg-main flex flex-col justify-between min-h-screen">
    <Nav/>
    <Outlet/>
    </div>
  )
}