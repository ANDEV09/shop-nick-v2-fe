import { Search, Bell, Settings, Home, Moon, Maximize2 } from "lucide-react";

export default function AdminHeader() {
    return (
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
            {/* Search Bar */}
            <div className="flex flex-1 items-center gap-4">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Right Side Icons & User Info */}
            <div className="flex items-center gap-6">
                <Home className="cursor-pointer text-gray-400 hover:text-gray-600" size={20} />
                <Moon className="cursor-pointer text-gray-400 hover:text-gray-600" size={20} />
                <Maximize2 className="cursor-pointer text-gray-400 hover:text-gray-600" size={20} />
                <Bell className="cursor-pointer text-gray-400 hover:text-gray-600" size={20} />
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=adminanori"
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium">adminanori</span>
                <span className="text-xs text-gray-500">Web Developer</span>
                <Settings className="cursor-pointer text-gray-400 hover:text-gray-600" size={20} />
            </div>
        </div>
    );
}
