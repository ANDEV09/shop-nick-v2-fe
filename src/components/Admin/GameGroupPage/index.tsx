import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, Pencil, Trash2, ArrowLeft, Eye } from "lucide-react";
import AdminSidebar from "~/components/Admin/AdminSidebar";
import AdminHeader from "~/components/Admin/AdminHeader";

interface GameGroup {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    active: number;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
}

interface Category {
    id: string;
    name: string;
}

export default function GameGroupPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [groups, setGroups] = useState<GameGroup[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingGroup, setEditingGroup] = useState<GameGroup | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        thumbnail: "",
        status: "active",
    });

    useEffect(() => {
        if (categoryId) {
            fetchCategory();
            fetchGroups();
        }
    }, [categoryId, itemsPerPage, currentPage]);

    const fetchCategory = async () => {
        try {
            const response = await fetch(`http://localhost:8000/game-categories/${categoryId}`);
            const data = await response.json();
            if (data.result) {
                setCategory(data.result);
            }
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    };

    const fetchGroups = async () => {
        try {
            setLoading(true);
            // Sử dụng endpoint mới cho admin lấy group theo category, có phân trang
            const response = await fetch(
                `http://localhost:8000/game-groups/admin/category/${categoryId}?page=${currentPage}&limit=${itemsPerPage}`,
            );
            const data = await response.json();

            if (data.result && data.result.data && Array.isArray(data.result.data)) {
                setGroups(data.result.data);
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
                setGroups(data.result);
                setTotalPages(1);
                setTotalItems(data.result.length);
            } else if (data.data && Array.isArray(data.data)) {
                setGroups(data.data);
                const pagination = data.pagination || data.meta || data;
                setTotalPages(
                    pagination.totalPages ||
                        pagination.total_pages ||
                        Math.ceil((pagination.totalItems || pagination.total || data.data.length) / itemsPerPage),
                );
                setTotalItems(pagination.totalItems || pagination.total || data.data.length);
            } else if (Array.isArray(data)) {
                setGroups(data);
                setTotalPages(1);
                setTotalItems(data.length);
            } else {
                setGroups([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa nhóm này?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/game-groups/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log("Delete response:", data);

            if (response.ok || data.success) {
                alert("Xóa nhóm thành công!");
                fetchGroups();
            } else {
                alert(`Xóa nhóm thất bại: ${data.message || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Error deleting group:", error);
            alert("Có lỗi xảy ra khi xóa nhóm!");
        }
    };

    const handleEdit = (group: GameGroup) => {
        setEditingGroup(group);
        setFormData({
            title: group.title,
            thumbnail: group.thumbnail,
            status: group.active === 1 ? "active" : "inactive",
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingGroup) return;

        try {
            const response = await fetch(`http://localhost:8000/game-groups/${editingGroup.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    categoryId: categoryId,
                    thumbnail: formData.thumbnail,
                    active: formData.status === "active" ? 1 : 0,
                }),
            });

            const data = await response.json();

            if (response.ok || data.success) {
                alert("Cập nhật nhóm thành công!");
                setShowEditModal(false);
                setEditingGroup(null);
                setFormData({ title: "", thumbnail: "", status: "active" });
                fetchGroups();
            } else {
                alert(`Cập nhật nhóm thất bại: ${data.message || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Error updating group:", error);
            alert("Có lỗi xảy ra khi cập nhật nhóm!");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />

                <div className="flex-1 overflow-y-auto scroll-smooth p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">
                            {category ? `Nhóm tài khoản: ${category.name}` : "Admin: Accounts Groups"}
                        </h1>
                    </div>
                    <div className="mb-8 flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin/game-categories")}
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-200"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <p className="text-sm text-gray-600">Danh sách các nhóm thuộc chuyên mục này</p>
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
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                                <span className="text-sm text-gray-600">entries</span>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                <Plus size={18} />
                                Thêm nhóm mới
                            </button>
                        </div>

                        <div className="mb-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Thao tác</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên nhóm</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Thumbnail</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Người tạo</th>
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
                                    ) : groups.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-gray-500">
                                                Chưa có nhóm nào
                                            </td>
                                        </tr>
                                    ) : (
                                        groups.map((group, index) => (
                                            <tr key={group.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/game-accounts/${group.id}`)}
                                                            className="rounded p-1.5 text-green-600 transition hover:bg-green-50"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(group)}
                                                            className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(group.id)}
                                                            className="rounded p-1.5 text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-medium text-gray-700">{group.title}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {group.thumbnail ? (
                                                        <img
                                                            src={group.thumbnail}
                                                            alt={group.title}
                                                            className="h-24 w-auto rounded object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Không có ảnh</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">Admin</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                            group.active === 1
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {group.active === 1 ? "Hoạt động" : "Không hoạt động"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    {group.createdAt
                                                        ? new Date(group.createdAt).toLocaleDateString("vi-VN")
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
                                Showing {groups.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                                {Math.min(currentPage * itemsPerPage, totalItems || groups.length)} of{" "}
                                {totalItems || groups.length} entries
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

            {/* Add Modal */}
            {showModal && (
                <div
                    className="animate-in fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 duration-100"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="animate-in slide-in-from-top-8 relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Thêm nhóm mới</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tên nhóm</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập tên nhóm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Thumbnail</label>
                                <input
                                    type="text"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập link ảnh"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch("http://localhost:8000/game-groups", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            title: formData.title,
                                            thumbnail: formData.thumbnail,
                                            active: formData.status === "active" ? 1 : 0,
                                            categoryId: categoryId,
                                        }),
                                    });

                                    const data = await response.json();

                                    if (response.ok) {
                                        await fetchGroups();
                                        setShowModal(false);
                                        setFormData({ title: "", thumbnail: "", status: "active" });
                                        alert("Thêm nhóm thành công!");
                                    } else {
                                        alert(`Lỗi: ${data.message || "Không thể thêm nhóm"}`);
                                    }
                                } catch (error) {
                                    console.error("Error creating group:", error);
                                    alert("Có lỗi xảy ra khi thêm nhóm!");
                                }
                            }}
                            className="mt-6 w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-700"
                        >
                            Thêm mới
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div
                    className="animate-in fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 duration-100"
                    onClick={() => {
                        setShowEditModal(false);
                        setEditingGroup(null);
                        setFormData({ title: "", thumbnail: "", status: "active" });
                    }}
                >
                    <div
                        className="animate-in slide-in-from-top-8 relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa nhóm</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingGroup(null);
                                    setFormData({ title: "", thumbnail: "", status: "active" });
                                }}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tên nhóm</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập tên nhóm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Thumbnail</label>
                                <input
                                    type="text"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập link ảnh"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleUpdate}
                            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
