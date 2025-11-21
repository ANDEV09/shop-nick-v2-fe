import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "~/context/AuthContext";

interface ServiceOrderItem {
    id: string | number;
    serviceName?: string;
    customer?: { username?: string; id?: string | number };
    price?: number;
    status?: string;
    createdAt?: string;
    user?: { username?: string; id?: string | number };
    package?: { name?: string };
    service?: { name?: string };
}

const AdminServiceOrders = () => {
    const { user } = useAuth();
    const [data, setData] = useState<ServiceOrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // Modal edit state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<ServiceOrderItem | null>(null);
    const [editStatus, setEditStatus] = useState<string>("");
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/orders/admin/all?page=${currentPage}&limit=${itemsPerPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.access_token}`,
                        },
                    },
                );
                const res = await response.json();
                if (response.ok) {
                    let items: ServiceOrderItem[] = [];
                    let totalCount = 0;
                    if (res?.result?.data && Array.isArray(res.result.data)) {
                        items = res.result.data;
                        totalCount = res.result.total || items.length;
                    } else if (Array.isArray(res.result)) {
                        items = res.result;
                        totalCount = items.length;
                    }
                    setData(items);
                    setTotal(totalCount);
                } else {
                    setError(res.message || "Không thể tải dữ liệu");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, currentPage, itemsPerPage]);

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {successMsg && (
                <div className="animate-fade-in fixed top-25 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-2xl bg-green-100 px-6 py-4 text-center text-lg font-bold text-green-700 shadow-lg">
                    {successMsg}
                </div>
            )}
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold text-gray-800">Admin: Lịch sử đơn cày thuê</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400">|</span>
                    <span>Quản Lý Lịch Sử Đơn Cày Thuê</span>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="rounded border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <span className="text-sm text-gray-600">entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Lọc trạng thái:</span>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">Tất cả</option>
                            <option value="0">Chờ nhận</option>
                            <option value="1">Đang xử lí</option>
                            <option value="2">Hoàn thành</option>
                        </select>
                    </div>
                </div>

                <div className="mb-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Gói cày</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Gói dịch vụ</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Người đặt</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Giá</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Ngày tạo</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Sửa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        Chưa có đơn cày thuê nào.
                                    </td>
                                </tr>
                            ) : (
                                data
                                    .filter((item) =>
                                        filterStatus === "all" ? true : String(item.status) === filterStatus,
                                    )
                                    .map((item, idx) => (
                                        <tr key={String(item.id)} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 text-center">
                                                {(currentPage - 1) * itemsPerPage + idx + 1}
                                            </td>
                                            <td className="px-4 py-2">{item.service?.name ?? "-"}</td>
                                            <td className="px-4 py-2">{item.package?.name ?? "-"}</td>
                                            <td className="px-4 py-2">{item.user?.username ?? "-"}</td>
                                            <td className="px-4 py-2 font-semibold text-blue-600">
                                                {item.price ? item.price.toLocaleString() : 0} ₫
                                            </td>
                                            <td className="px-4 py-2">
                                                {(() => {
                                                    const statusStr = String(item.status);
                                                    let label = "-";
                                                    let color = "bg-gray-100 text-gray-700";
                                                    if (statusStr === "0") {
                                                        label = "Đơn chờ nhận";
                                                        color = "bg-yellow-100 text-yellow-800";
                                                    } else if (statusStr === "1") {
                                                        label = "Đang xử lí";
                                                        color = "bg-blue-100 text-blue-700";
                                                    } else if (statusStr === "2") {
                                                        label = "Hoàn thành";
                                                        color = "bg-green-100 text-green-700";
                                                    }
                                                    return (
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-medium ${color}`}
                                                        >
                                                            {label}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    className="flex items-center gap-1 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                                                    onClick={() => {
                                                        setEditingOrder(item);
                                                        setEditStatus(String(item.status ?? "0"));
                                                        setShowEditModal(true);
                                                        setUpdateError(null);
                                                    }}
                                                >
                                                    <Pencil size={16} />
                                                    Sửa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        Hiển thị {total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} đến{" "}
                        {Math.min(currentPage * itemsPerPage, total)} trong tổng {total} dòng
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Trang {currentPage} / {Math.max(1, Math.ceil(total / itemsPerPage))}
                        </span>
                        <button
                            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(total / itemsPerPage), p + 1))}
                            disabled={currentPage === Math.ceil(total / itemsPerPage) || total === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            {showEditModal && editingOrder && (
                <div
                    className="animate-in fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 duration-100"
                    onClick={() => {
                        setShowEditModal(false);
                        setEditingOrder(null);
                        setEditStatus("");
                        setSuccessMsg("Cập nhật trạng thái đơn thành công!");
                        setTimeout(() => setSuccessMsg(""), 2000);
                        {
                            successMsg && (
                                <div className="animate-fade-in mb-6 rounded-2xl bg-green-100 px-6 py-4 text-center text-lg font-bold text-green-700 shadow-lg">
                                    {successMsg}
                                </div>
                            );
                        }
                        setUpdateError(null);
                    }}
                >
                    <div
                        className="animate-in slide-in-from-top-8 relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa trạng thái đơn hàng</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingOrder(null);
                                    setEditStatus("");
                                    setUpdateError(null);
                                }}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        {/* Form */}
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700 md:mb-0 md:w-32">
                                    Trạng thái
                                </label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-60"
                                >
                                    <option value="0">Đơn chờ nhận</option>
                                    <option value="1">Đang xử lí</option>
                                    <option value="2">Hoàn thành</option>
                                </select>
                            </div>
                            {updateError && <div className="text-sm text-red-500">{updateError}</div>}
                        </div>
                        {/* Submit Button */}
                        <button
                            onClick={async () => {
                                if (!editingOrder) return;
                                setUpdating(true);
                                setUpdateError(null);
                                try {
                                    const res = await fetch(
                                        `http://localhost:8000/orders/admin/${editingOrder.id}/status`,
                                        {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${user?.access_token}`,
                                            },
                                            body: JSON.stringify({ status: Number(editStatus) }),
                                        },
                                    );
                                    const data = await res.json();
                                    if (res.ok) {
                                        setUpdateError(null);
                                        setUpdating(true);
                                        // reload data, chỉ đóng modal khi đã có data mới
                                        const response = await fetch(
                                            `http://localhost:8000/orders/admin/all?page=${currentPage}&limit=${itemsPerPage}`,
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${user?.access_token}`,
                                                },
                                            },
                                        );
                                        const resData = await response.json();
                                        let items: ServiceOrderItem[] = [];
                                        let totalCount = 0;
                                        if (resData?.result?.data && Array.isArray(resData.result.data)) {
                                            items = resData.result.data;
                                            totalCount = resData.result.total || items.length;
                                        } else if (Array.isArray(resData.result)) {
                                            items = resData.result;
                                            totalCount = items.length;
                                        }
                                        setData(items);
                                        setTotal(totalCount);
                                        setShowEditModal(false);
                                        setEditingOrder(null);
                                        setEditStatus("");
                                        setSuccessMsg("Cập nhật trạng thái đơn thành công!");
                                        setTimeout(() => setSuccessMsg(""), 2000);
                                    } else {
                                        setUpdateError(data.message || "Cập nhật thất bại");
                                    }
                                } catch (e) {
                                    setUpdateError("Có lỗi xảy ra khi cập nhật");
                                } finally {
                                    setUpdating(false);
                                }
                            }}
                            disabled={updating}
                            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {updating ? "Đang cập nhật..." : "Cập nhật"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServiceOrders;
