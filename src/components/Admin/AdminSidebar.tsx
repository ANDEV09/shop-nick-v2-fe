import type React from "react";
import { useState } from "react";
import {
    Menu,
    Home,
    BarChart3,
    Users,
    FileText,
    Settings,
    Lock,
    AlertCircle,
    CreditCard,
    Notebook as LogBook,
    MessageSquare,
    LogOut,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
    icon: React.ElementType;
    label: string;
    hasArrow?: boolean;
    badge?: string | null;
    onClick?: () => void;
    isOpen?: boolean;
    children?: React.ReactNode;
}

const MenuItem = ({ icon: Icon, label, hasArrow = false, badge = null, onClick, isOpen, children }: MenuItemProps) => (
    <>
        <div
            onClick={onClick}
            className="hover:bg-black-700 flex cursor-pointer items-center justify-between rounded-md px-4 py-3 text-gray-300 transition"
        >
            <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm">{label}</span>
            </div>
            {badge && <span className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">{badge}</span>}
            {hasArrow && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </div>
        {isOpen && children && <div className="ml-4">{children}</div>}
    </>
);

const SubMenuItem = ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <div
        onClick={onClick}
        className="hover:bg-black-700 cursor-pointer rounded-md px-4 py-2 text-sm text-gray-400 transition hover:text-white"
    >
        {label}
    </div>
);

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    currentPage?: string;
    setCurrentPage?: (page: string) => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, setCurrentPage }: AdminSidebarProps) {
    const [gameMenuOpen, setGameMenuOpen] = useState(false);
    const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Handle logout logic
        console.log("Logout clicked");
    };

    return (
        <div
            className={`${sidebarOpen ? "w-65" : "w-20"} flex flex-col overflow-y-auto bg-[#19244A] text-white transition-all duration-300`}
        >
            {/* Logo Section */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white">
                        <BarChart3 size={18} className="text-blue-900" />
                    </div>
                    {sidebarOpen && <span className="text-sm font-bold">Logo</span>}
                </div>
                <Menu size={20} onClick={() => setSidebarOpen(!sidebarOpen)} className="cursor-pointer" />
            </div>

            {/* Main Section */}
            <div className="p-4">
                <div className="mb-3 text-xs font-bold text-blue-300">MAIN</div>
                <MenuItem icon={Home} label="Bảng Điều Khiển" onClick={() => navigate("/admin")} />
            </div>

            {/* Quick Access Section */}
            <div className="p-4">
                <div className="mb-3 text-xs font-bold text-blue-300">QUICK ACCESS</div>
                <MenuItem
                    icon={Users}
                    label="Bán Nick Game"
                    hasArrow
                    isOpen={gameMenuOpen}
                    onClick={() => setGameMenuOpen(!gameMenuOpen)}
                >
                    <SubMenuItem label="Danh mục game" onClick={() => navigate("/admin/game-categories")} />
                    <SubMenuItem label="Lịch sử mua nick" onClick={() => navigate("/admin/purchase-history")} />
                </MenuItem>
                <MenuItem
                    icon={Users}
                    label="Dịch Vụ Cài Thuê"
                    hasArrow
                    isOpen={serviceMenuOpen}
                    onClick={() => setServiceMenuOpen(!serviceMenuOpen)}
                >
                    <SubMenuItem label="Chuyên mục cày thuê" onClick={() => navigate("/admin/game-services")} />
                    <SubMenuItem label="Lịch sử đơn cày" onClick={() => navigate("/admin/service-orders")} />
                </MenuItem>
            </div>

            {/* System Settings Section */}
            <div className="p-4">
                <div className="mb-3 text-xs font-bold text-blue-300">SYSTEM SETTINGS</div>
                <MenuItem icon={FileText} label="Danh Sách Ghim" />
                <MenuItem icon={Settings} label="Cài Đặt Hệ Thống" />
                <MenuItem icon={Lock} label="Cấu Hình API Keys" />
                <MenuItem icon={AlertCircle} label="Cài Đặt Thông Báo" />
            </div>

            {/* Users Manager Section */}
            <div className="border-b border-blue-800 p-4">
                <div className="mb-3 text-xs font-bold text-blue-300">USERS MANAGER</div>
                <MenuItem icon={Users} label="Quản Lý Thành Viên" />
                <MenuItem icon={CreditCard} label="Thống Tin Nạp Tiền" />
                <MenuItem icon={LogBook} label="Lịch Sử Giao Dịch" />
                <MenuItem icon={BarChart3} label="Lịch Sử Hoạt Động" />
                <MenuItem icon={FileText} label="Lịch Sử Nạp Thẻ Cào" />
                <MenuItem icon={CreditCard} label="Lịch Sử Nạp Tiền Bank" />
            </div>

            {/* Staff Manager Section */}
            <div className="p-4">
                <div className="mb-3 text-xs font-bold text-blue-300">STAFF MANAGER</div>
                <MenuItem icon={MessageSquare} label="Yêu Cầu Rút Tiền" badge="9" />
                <MenuItem icon={FileText} label="Quản Lý Chuyên Mục" onClick={() => setCurrentPage?.("category")} />
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Logout Section */}
            <div className="border-t border-blue-800 p-4">
                <MenuItem icon={LogOut} label="Đăng Xuất" onClick={handleLogout} />
            </div>
        </div>
    );
}
