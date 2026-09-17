import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "@/app/layouts";
import { SpecializationsListPage } from "@/pages/admin/specialization/specializations-list";
import { SpecializationDetailsPage } from "@/pages/admin/specialization/specialization-details";

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
                path: "specializations/create",
                element: <SpecializationDetailsPage mode="create" />,
            },
            {
                path: "specializations/:id",
                element: <SpecializationDetailsPage mode="view" />,
            },
        ],
    },
]);