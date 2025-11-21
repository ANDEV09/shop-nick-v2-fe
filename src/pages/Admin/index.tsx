import { useState, useEffect } from "react";
import AdminSidebar from "~/components/Admin/AdminSidebar";
import AdminHeader from "~/components/Admin/AdminHeader";
import Dashboard from "./Dashboard";
import AdminPurchaseHistory from "./PurchaseHistory";
import AdminServiceOrders from "./ServiceOrders";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "~/context/AuthContext";

export default function AdminPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        // Nếu chưa đăng nhập, hoặc không có access_token thì về trang đăng nhập
        if (!user || !user.access_token) {
            navigate("/login", { replace: true });
            return;
        }
        // Nếu không phải admin thì cảnh báo và về trang chủ
        if (!user.role || String(user.role) !== "ADMIN") {
            alert("Bạn không có quyền truy cập trang quản trị!");
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    let content = <Dashboard />;
    if (location.pathname === "/admin/purchase-history") {
        content = <AdminPurchaseHistory />;
    } else if (location.pathname === "/admin/service-orders") {
        content = <AdminServiceOrders />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />
                {content}
            </div>
        </div>
    );
}
