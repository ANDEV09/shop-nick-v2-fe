import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/context/AuthContext";
import { Plus, X, Pencil, Trash2, Eye } from "lucide-react";
import AdminSidebar from "~/components/Admin/AdminSidebar";
import AdminHeader from "~/components/Admin/AdminHeader";

interface Category {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    active: number;
    createdAt: string;
    updatedAt: string;
}

export default function GameCategoryPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [, setCurrentTablePage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        thumbnail: "",
        status: "active",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Sử dụng endpoint mới cho admin lấy tất cả category (active 0/1)
            const response = await fetch("http://localhost:8000/game-categories/admin/all", {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });
            const data = await response.json();

            if (data.result && Array.isArray(data.result)) {
                setCategories(data.result);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/game-categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });
            const data = await response.json();
            if (response.ok || data.success) {
                alert("Xóa danh mục thành công!");
                fetchCategories();
            } else {
                alert(`Xóa danh mục thất bại: ${data.message || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Có lỗi xảy ra khi xóa danh mục!");
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            thumbnail: category.thumbnail,
            status: category.active === 1 ? "active" : "inactive",
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingCategory) return;
        try {
            const response = await fetch(`http://localhost:8000/game-categories/${editingCategory.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.access_token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    thumbnail: formData.thumbnail,
                    active: formData.status === "active" ? 1 : 0,
                }),
            });
            const data = await response.json();
            if (response.ok || data.success) {
                alert("Cập nhật danh mục thành công!");
                setShowEditModal(false);
                setEditingCategory(null);
                setFormData({ name: "", thumbnail: "", status: "active" });
                fetchCategories();
            } else {
                alert(`Cập nhật danh mục thất bại: ${data.message || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Có lỗi xảy ra khi cập nhật danh mục!");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />

                <div className="flex-1 overflow-y-auto scroll-smooth p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">Admin: Accounts Category</h1>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Show</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentTablePage(1);
                                    }}
                                    className="rounded border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-600">entries</span>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                <Plus size={18} />
                                Thêm danh mục mới
                            </button>
                        </div>
                        <div className="mb-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Thao tác</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Tên chuyên mục
                                        </th>
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
                                    ) : categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-gray-500">
                                                No data available in table
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category, index) => (
                                            <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/admin/game-groups/${category.id}`)
                                                            }
                                                            className="rounded p-1.5 text-green-600 transition hover:bg-green-50"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(category)}
                                                            className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(category.id)}
                                                            className="rounded p-1.5 text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-medium text-gray-700">{category.name}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {category.thumbnail ? (
                                                        <img
                                                            src={category.thumbnail}
                                                            alt={category.name}
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
                                                            category.active === 1
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {category.active === 1 ? "Hoạt động" : "Không hoạt động"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    {category.createdAt
                                                        ? new Date(category.createdAt).toLocaleDateString("vi-VN")
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
                                Showing {categories.length > 0 ? 1 : 0} to {categories.length} of {categories.length}{" "}
                                entries
                            </span>
                            <div className="flex items-center gap-2">
                                <button className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50">
                                    Previous
                                </button>
                                <button className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>

                        {/* nút thêm danh mục đã chuyển lên trên */}
                    </div>
                </div>
            </div>

            {/* Modal Popup */}
            {showModal && (
                <div
                    className="animate-in fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 duration-100"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="animate-in slide-in-from-top-8 relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Thêm thông tin mới</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Tên chuyên mục */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tên chuyên mục</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập tên chuyên mục"
                                />
                            </div>

                            {/* Link */}
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

                            {/* Trạng thái */}
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

                        {/* Button */}
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch("http://localhost:8000/game-categories", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${user?.access_token}`,
                                        },
                                        body: JSON.stringify({
                                            name: formData.name,
                                            thumbnail: formData.thumbnail,
                                            active: formData.status === "active" ? 1 : 0,
                                        }),
                                    });
                                    const data = await response.json();
                                    if (response.ok) {
                                        // Success - refresh danh sách
                                        await fetchCategories();
                                        setShowModal(false);
                                        setFormData({ name: "", thumbnail: "", status: "active" });
                                        alert("Thêm danh mục thành công!");
                                    } else {
                                        alert(`Lỗi: ${data.message || "Không thể thêm danh mục"}`);
                                    }
                                } catch (error) {
                                    console.error("Error creating category:", error);
                                    alert("Có lỗi xảy ra khi thêm danh mục!");
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
                        setEditingCategory(null);
                        setFormData({ name: "", thumbnail: "", status: "active" });
                    }}
                >
                    <div
                        className="animate-in slide-in-from-top-8 relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa danh mục</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingCategory(null);
                                    setFormData({ name: "", thumbnail: "", status: "active" });
                                }}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Tên chuyên mục */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tên chuyên mục</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập tên chuyên mục"
                                />
                            </div>

                            {/* Thumbnail */}
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

                            {/* Trạng thái */}
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

                        {/* Submit Button */}
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
