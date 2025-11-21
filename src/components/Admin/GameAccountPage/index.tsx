import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, Trash2, ArrowLeft } from "lucide-react";
import AdminSidebar from "~/components/Admin/AdminSidebar";
import AdminHeader from "~/components/Admin/AdminHeader";

interface GameAccount {
    id: string;
    name: string;
    title: string;
    price: number;
    description: string;
    thumb: string;
    details?: Record<string, any>;
    images?: string[];
    active: number;
    groupId: string;
    createdAt: string;
    updatedAt: string;
}

interface GameGroup {
    id: string;
    title: string;
}

export default function GameAccountPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [accounts, setAccounts] = useState<GameAccount[]>([]);
    const [group, setGroup] = useState<GameGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        accountName: "",
        password: "",
        price: "",
        thumb: "",
        status: "active",
    });

    const [details, setDetails] = useState<{ key: string; value: string }[]>([]);
    const [images, setImages] = useState<string>("");

    useEffect(() => {
        if (groupId) {
            fetchGroup();
            fetchAccounts();
        }
    }, [groupId, itemsPerPage, currentPage]);

    const fetchGroup = async () => {
        try {
            const response = await fetch(`http://localhost:8000/game-groups/${groupId}`);
            const data = await response.json();
            if (data.result) {
                setGroup(data.result);
            }
        } catch (error) {
            console.error("Error fetching group:", error);
        }
    };

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8000/game-accounts/admin/group/${groupId}?page=${currentPage}&limit=${itemsPerPage}`,
            );
            const data = await response.json();

            // Try multiple possible response structures
            if (data.result && data.result.data && Array.isArray(data.result.data)) {
                setAccounts(data.result.data);
                // Check various pagination field names
                const pagination = data.result.pagination || data.result.meta || data.result;
                setTotalPages(
                    pagination.totalPages ||
                        pagination.total_pages ||
                        Math.ceil(
                            (pagination.totalItems || pagination.total || data.result.data.length) / itemsPerPage,
                        ),
                );
                setTotalItems(pagination.totalItems || pagination.total || data.result.data.length);
            } else if (data.result && Array.isArray(data.result)) {
                setAccounts(data.result);
                setTotalPages(1);
                setTotalItems(data.result.length);
            } else if (data.data && Array.isArray(data.data)) {
                setAccounts(data.data);
                const pagination = data.pagination || data.meta || data;
                setTotalPages(
                    pagination.totalPages ||
                        pagination.total_pages ||
                        Math.ceil((pagination.totalItems || pagination.total || data.data.length) / itemsPerPage),
                );
                setTotalItems(pagination.totalItems || pagination.total || data.data.length);
            } else if (Array.isArray(data)) {
                setAccounts(data);
                setTotalPages(1);
                setTotalItems(data.length);
            } else {
                setAccounts([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (error) {
            console.error("Error fetching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/game-accounts/account/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok || data.success) {
                alert("Xóa tài khoản thành công!");
                fetchAccounts();
            } else {
                alert(`Xóa tài khoản thất bại: ${data.message || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Có lỗi xảy ra khi xóa tài khoản!");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />

                <div className="flex-1 overflow-y-auto scroll-smooth p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">Admin: Accounts Lists</h1>
                    </div>
                    <div className="mb-8 flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-200"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <p className="text-sm text-gray-600">Danh sách các tài khoản thuộc nhóm này</p>
                        </div>
                    </div>

                    {/* Add Account Form */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-bold text-gray-800">Thêm tài khoản mới</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Tên hiển thị (name)
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Nhập tên hiển thị"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Tên tài khoản (accountName)
                                </label>
                                <input
                                    type="text"
                                    value={formData.accountName}
                                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Nhập tên tài khoản"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Giá</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Nhập giá"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Thumbnail</label>
                                <input
                                    type="text"
                                    value={formData.thumb}
                                    onChange={(e) => setFormData({ ...formData, thumb: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Nhập link ảnh thumbnail"
                                />
                            </div>

                            {/* Details Section */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Chi tiết tài khoản (Details)
                                </label>
                                <div className="space-y-2">
                                    {details.map((detail, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={detail.key}
                                                onChange={(e) => {
                                                    const newDetails = [...details];
                                                    newDetails[index].key = e.target.value;
                                                    setDetails(newDetails);
                                                }}
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="Tên thuộc tính (vd: tuong)"
                                            />
                                            <input
                                                type="text"
                                                value={detail.value}
                                                onChange={(e) => {
                                                    const newDetails = [...details];
                                                    newDetails[index].value = e.target.value;
                                                    setDetails(newDetails);
                                                }}
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="Giá trị (vd: 100)"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newDetails = details.filter((_, i) => i !== index);
                                                    setDetails(newDetails);
                                                }}
                                                className="rounded-lg bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setDetails([...details, { key: "", value: "" }])}
                                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                    >
                                        <Plus size={16} />
                                        Thêm thuộc tính
                                    </button>
                                </div>
                            </div>

                            {/* Images Section */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Danh sách ảnh (Images) - Mỗi dòng 1 link
                                </label>
                                <textarea
                                    value={images}
                                    onChange={(e) => setImages(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Nhập mỗi link ảnh trên 1 dòng&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                    rows={4}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    onClick={async () => {
                                        try {
                                            // Convert details array to object
                                            const detailsObject: Record<string, any> = {};
                                            details.forEach((detail) => {
                                                if (detail.key && detail.key.trim()) {
                                                    // Try to convert to number if possible
                                                    const numValue = Number(detail.value);
                                                    detailsObject[detail.key.trim()] = isNaN(numValue)
                                                        ? detail.value
                                                        : numValue;
                                                }
                                            });

                                            // Parse images from textarea (one URL per line)
                                            const imageArray = images
                                                .split("\n")
                                                .map((url) => url.trim())
                                                .filter((url) => url.length > 0);

                                            const response = await fetch(
                                                `http://localhost:8000/game-accounts/${groupId}/account`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        name: formData.name,
                                                        accountName: formData.accountName,
                                                        password: formData.password,
                                                        price: Number(formData.price),
                                                        details: detailsObject,
                                                        thumb: formData.thumb,
                                                        images: imageArray,
                                                    }),
                                                },
                                            );

                                            const data = await response.json();

                                            if (response.ok) {
                                                await fetchAccounts();
                                                setFormData({
                                                    name: "",
                                                    accountName: "",
                                                    password: "",
                                                    price: "",
                                                    thumb: "",
                                                    status: "active",
                                                });
                                                setDetails([]);
                                                setImages("");
                                                alert("Thêm tài khoản thành công!");
                                            } else {
                                                alert(`Lỗi: ${data.message || "Không thể thêm tài khoản"}`);
                                            }
                                        } catch (error) {
                                            console.error("Error creating account:", error);
                                            alert("Có lỗi xảy ra khi thêm tài khoản!");
                                        }
                                    }}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
                                >
                                    <Plus size={18} />
                                    Thêm tài khoản
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account List */}
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
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                                <span className="text-sm text-gray-600">entries</span>
                            </div>
                        </div>

                        <div className="mb-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Thao tác</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Tên hiển thị
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Giá</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Thumbnail</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-gray-500">
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : accounts.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-gray-500">
                                                Chưa có tài khoản nào
                                            </td>
                                        </tr>
                                    ) : (
                                        accounts.map((account, index) => (
                                            <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleDelete(account.id)}
                                                            className="rounded p-1.5 text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-medium text-gray-700">
                                                        {account.name || account.title}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-semibold text-green-600">
                                                        {account.price.toLocaleString("vi-VN")}đ
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {account.thumb ? (
                                                        <img
                                                            src={account.thumb}
                                                            alt={account.name || account.title}
                                                            className="h-24 w-auto rounded object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Không có ảnh</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                            account.active === 1
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                    >
                                                        {account.active === 1 ? "Đã bán" : "Chưa bán"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    {account.createdAt
                                                        ? new Date(account.createdAt).toLocaleDateString("vi-VN")
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {accounts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                                {Math.min(currentPage * itemsPerPage, totalItems || accounts.length)} of{" "}
                                {totalItems || accounts.length} entries
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center px-3 text-sm text-gray-600">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
