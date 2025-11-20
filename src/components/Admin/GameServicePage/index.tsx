import { useState, useEffect } from "react";
import AdminSidebar from "~/components/Admin/AdminSidebar";
import AdminHeader from "~/components/Admin/AdminHeader";
import { Plus, Trash2, X, Pencil, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameService {
    id: string;
    name: string;
    thumbnail: string;
    description: string;
    active: number;
    createdAt?: string;
    updatedAt?: string;
}

export default function GameServicePage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [services, setServices] = useState<GameService[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingService, setEditingService] = useState<GameService | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        thumbnail: "",
        description: "",
        active: 1,
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/game-services");
            const data = await res.json();
            if (Array.isArray(data.result)) setServices(data.result);
            else if (data.result && Array.isArray(data.result.data)) setServices(data.result.data);
            else setServices([]);
        } catch (e) {
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.name.trim()) return alert("Nhập tên dịch vụ!");
        try {
            const res = await fetch("http://localhost:8000/game-services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok || data.success) {
                setShowModal(false);
                setFormData({ name: "", thumbnail: "", description: "", active: 1 });
                fetchServices();
                alert("Thêm dịch vụ thành công!");
            } else alert(data.message || "Thêm thất bại!");
        } catch {
            alert("Có lỗi khi thêm!");
        }
    };

    const handleEdit = (service: GameService) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            thumbnail: service.thumbnail,
            description: service.description,
            active: service.active,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingService) return;
        try {
            const res = await fetch(`http://localhost:8000/game-services/${editingService.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok || data.success) {
                setShowEditModal(false);
                setEditingService(null);
                setFormData({ name: "", thumbnail: "", description: "", active: 1 });
                fetchServices();
                alert("Cập nhật dịch vụ thành công!");
            } else alert(data.message || "Cập nhật thất bại!");
        } catch {
            alert("Có lỗi khi cập nhật!");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Xóa dịch vụ này?")) return;
        try {
            const res = await fetch(`http://localhost:8000/game-services/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok || data.success) fetchServices();
            else alert(data.message || "Xóa thất bại!");
        } catch {
            alert("Có lỗi khi xóa!");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />
                <div className="flex-1 overflow-y-auto scroll-smooth p-8">
                    <div className="mb-8">
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">Admin: Dịch vụ cày thuê</h1>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Danh sách dịch vụ</span>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                <Plus size={18} /> Thêm dịch vụ
                            </button>
                        </div>
                        <div className="mb-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Thao tác</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên dịch vụ</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Thumbnail</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Mô tả</th>
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
                                    ) : services.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-gray-500">
                                                Chưa có dịch vụ nào
                                            </td>
                                        </tr>
                                    ) : (
                                        services.map((service, idx) => (
                                            <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-700">{idx + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/admin/service-packages/${service.id}`)
                                                            }
                                                            className="rounded p-1.5 text-green-600 transition hover:bg-green-50"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(service)}
                                                            className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(service.id)}
                                                            className="rounded p-1.5 text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-700">{service.name}</td>
                                                <td className="px-4 py-3">
                                                    {service.thumbnail ? (
                                                        <img
                                                            src={service.thumbnail}
                                                            alt={service.name}
                                                            className="h-24 w-auto rounded object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Không có ảnh</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">{service.description}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${service.active === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                                    >
                                                        {service.active === 1 ? "Hoạt động" : "Không hoạt động"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    {service.createdAt
                                                        ? new Date(service.createdAt).toLocaleDateString("vi-VN")
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
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
                            <h2 className="text-xl font-bold text-gray-800">Thêm dịch vụ mới</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập tên dịch vụ"
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
                                <label className="mb-2 block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập mô tả dịch vụ"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="mt-6 w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-700"
                        >
                            Thêm mới
                        </button>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div
                    className="animate-in fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 duration-100"
                    onClick={() => {
                        setShowEditModal(false);
                        setEditingService(null);
                        setFormData({ name: "", thumbnail: "", description: "", active: 1 });
                    }}
                >
                    <div
                        className="animate-in slide-in-from-top-8 relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa dịch vụ</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingService(null);
                                    setFormData({ name: "", thumbnail: "", description: "", active: 1 });
                                }}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập tên dịch vụ"
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
                                <label className="mb-2 block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập mô tả dịch vụ"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select
                                    value={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value={1}>Hoạt động</option>
                                    <option value={0}>Không hoạt động</option>
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
