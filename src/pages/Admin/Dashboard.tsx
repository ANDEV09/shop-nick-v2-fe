import StatCard from "~/components/Admin/StatCard";

export default function Dashboard() {
    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Member Statistics Section */}
            <h1 className="mb-8 text-3xl font-bold text-gray-800">Thống Kê Thành Viên</h1>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard value="10" label="Thành Viên" />
                <StatCard value="1" label="Thành Viên mới" />
                <StatCard value="138,000" label="Tổng Số Dự" />
                <StatCard value="363,000" label="Tổng Tiền Nạp" />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard value="0" label="Nạp Thẻ Hôm Nay" />
                <StatCard value="0" label="Nạp Thẻ Tháng 11" />
                <StatCard value="0" label="Nạp Tiền Hôm Nay" />
                <StatCard value="133,000" label="Nạp Tiền Tháng 11" />
            </div>

            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard value="0" label="Tổng Tiền Nạp Hôm Nay" />
            </div>

            {/* Order Statistics Section */}
            <h1 className="mb-8 text-3xl font-bold text-gray-800">Thống Kê Đơn Tài Khoản</h1>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard value="4" label="Tổng Đơn Hàng" />
                <StatCard value="15,200" label="Tổng Doanh Thu" />
                <StatCard value="0" label="Đơn Hàng Hôm Nay" />
                <StatCard value="0" label="Đơn Hàng Hôm Qua" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard value="0" label="Doanh Thu Tuần" />
                <StatCard value="0" label="Doanh Thu Hôm Nay" />
                <StatCard value="0" label="Doanh Thu Tháng" />
                <StatCard value="0" label="Doanh Thu Hôm Qua" />
            </div>
        </div>
    );
}
