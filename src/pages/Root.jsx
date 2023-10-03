import { Outlet } from "react-router-dom";
import { Nav, Footer } from "../components/";

export function Root() {
  return (
    <div className="flex flex-col justify-between border-2 border-red-500 min-h-screen">
    <Nav/>
    <Outlet/>
    <Footer/>
    </div>
  )
}