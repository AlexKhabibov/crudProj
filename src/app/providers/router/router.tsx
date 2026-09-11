import { AdminLayout } from "@/app/layouts";
import { createBrowserRouter } from "react-router-dom";

export const routerConfig = createBrowserRouter([
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <div>Admin</div>,
            },
            {
                path: "specializations",
                element: <div>Specializations</div>,
            },
            {
                path: "specializations/:id",
                element: <div>Specialization detail</div>,
            },
        ],
    },
]);