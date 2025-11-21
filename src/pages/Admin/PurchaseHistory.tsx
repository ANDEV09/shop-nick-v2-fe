import { useEffect, useState } from "react";
import { formatNumber } from "~/utils/functions";
import { useAuth } from "~/context/AuthContext";

interface PurchaseItem {
    id: string | number;
    name?: string;
    accountName?: string;
    password?: string;
    price?: number;
    buyer?: { username?: string; id?: string | number };
    user?: { username?: string; id?: string | number };
    purchasedAt?: string;
    createdAt?: string;
}

const AdminPurchaseHistory = () => {
    const { user } = useAuth();
    const [data, setData] = useState<PurchaseItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/game-accounts/admin/sold-history?page=${currentPage}&limit=${itemsPerPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.access_token}`,
                        },
                    },
                );
                const res = await response.json();
                if (response.ok) {
                    let items: PurchaseItem[] = [];
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
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400">|</span>
                    <span>Quản Lý Lịch Sử Bán Nick</span>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
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
                            <option value={5}>10</option>
                            <option value={10}>25</option>
                            <option value={15}>50</option>
                        </select>
                        <span className="text-sm text-gray-600">entries</span>
                    </div>
                </div>

                <div className="mb-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên nick</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên đăng nhập</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Giá bán</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Người mua</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Ngày bán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        Chưa có lịch sử bán nick nào.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, idx) => (
                                    <tr key={String(item.id)} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                            {(currentPage - 1) * itemsPerPage + idx + 1}
                                        </td>
                                        <td className="px-4 py-2">{item.name ?? "-"}</td>
                                        <td className="px-4 py-2">{item.accountName ?? "-"}</td>
                                        <td className="px-4 py-2 font-semibold text-blue-600">
                                            {formatNumber(Number(item.price ?? 0))} ₫
                                        </td>
                                        <td className="px-4 py-2 font-bold text-green-700 text-base">{item.user?.username ?? "-"}</td>
                                        <td className="px-4 py-2">
                                            {item.purchasedAt
                                                ? new Date(item.purchasedAt).toLocaleDateString("vi-VN")
                                                : item.createdAt
                                                  ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                                                  : "-"}
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
        </div>
    );
};

export default AdminPurchaseHistory;
