import { useState } from "react";
import AdminSidebar from "~/components/Admin/AdminSidebar";
import AdminHeader from "~/components/Admin/AdminHeader";
import Dashboard from "./Dashboard";

export default function AdminPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />
                <Dashboard />
            </div>
        </div>
    );
}
