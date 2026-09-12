import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "@/app/layouts";
import { SpecializationsListPage } from "@/pages/admin/specializations-list";
import { SpecializationDetailsPage } from "@/pages/admin/specialization-details";

export const routerConfig = createBrowserRouter([
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <div>Admin route</div>,
            },
            {
                path: "specializations",
                element: <SpecializationsListPage />,
            },
            {
                path: "specializations/:id",
                element: <SpecializationDetailsPage />,
            },
        ],
    },
]);