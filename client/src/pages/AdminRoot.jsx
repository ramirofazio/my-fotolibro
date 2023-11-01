import { Outlet } from "react-router-dom";
import {AdminNav} from "../components/AdminNav.jsx"

export function AdminRoot() {
  return (
    <div className="bg-base flex flex-col justify-between min-h-screen">
    <AdminNav/>
    <Outlet/>
    </div>
  )
}