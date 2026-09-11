import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
    return (
        <>
            <Header />
            <Sidebar />
            <Outlet />
        </>
    )
};