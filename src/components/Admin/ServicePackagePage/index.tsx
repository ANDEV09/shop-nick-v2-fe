import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "~/components/Admin/AdminSidebar";
import AdminHeader from "~/components/Admin/AdminHeader";
import { Plus, Trash2, X, Pencil } from "lucide-react";

interface ServicePackage {
    id: string;
    name: string;
    price: number;
    createdAt?: string;
    updatedAt?: string;
}

export default function ServicePackagePage() {
    const { serviceId } = useParams<{ serviceId: string }>();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
    });

    useEffect(() => {
        fetchPackages();
    }, [serviceId]);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/service-packages/${serviceId}`);
            const data = await res.json();
            if (Array.isArray(data.result)) setPackages(data.result);
            else if (data.result && Array.isArray(data.result.data)) setPackages(data.result.data);
            else setPackages([]);
        } catch (e) {
            setPackages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.name.trim() || !formData.price) return alert("Nhập đủ tên và giá!");
        try {
            const res = await fetch(`http://localhost:8000/service-packages/game-services/${serviceId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    price: Number(formData.price),
                }),
            });
            const data = await res.json();
            if (res.ok || data.success) {
                setShowModal(false);
                setFormData({ name: "", price: "" });
                fetchPackages();
                alert("Thêm gói dịch vụ thành công!");
            } else alert(data.message || "Thêm thất bại!");
        } catch {
            alert("Có lỗi khi thêm!");
        }
    };

    const handleEdit = (pkg: ServicePackage) => {
        setEditingPackage(pkg);
        setFormData({ name: pkg.name, price: String(pkg.price) });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingPackage) return;
        if (!formData.name.trim() || !formData.price) return alert("Nhập đủ tên và giá!");
        try {
            const res = await fetch(`http://localhost:8000/service-packages/packages/${editingPackage.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    price: Number(formData.price),
                }),
            });
            const data = await res.json();
            if (res.ok || data.success) {
                setShowEditModal(false);
                setEditingPackage(null);
                setFormData({ name: "", price: "" });
                fetchPackages();
                alert("Cập nhật gói dịch vụ thành công!");
            } else alert(data.message || "Cập nhật thất bại!");
        } catch {
            alert("Có lỗi khi cập nhật!");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Xóa gói dịch vụ này?")) return;
        try {
            const res = await fetch(`http://localhost:8000/service-packages/packages/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok || data.success) {
                fetchPackages();
                alert("Xóa gói dịch vụ thành công!");
            } else alert(data.message || "Xóa thất bại!");
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
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-800">Gói dịch vụ</h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            <Plus size={18} /> Thêm gói
                        </button>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Thao tác</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên gói</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Giá</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : packages.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                            Chưa có gói nào
                                        </td>
                                    </tr>
                                ) : (
                                    packages.map((pkg, idx) => (
                                        <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3">{idx + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(pkg)}
                                                        className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(pkg.id)}
                                                        className="rounded p-1.5 text-red-600 transition hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-700">{pkg.name}</td>
                                            <td className="px-4 py-3 font-semibold text-green-700">
                                                {pkg.price.toLocaleString("vi-VN")}đ
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-600">
                                                {pkg.createdAt
                                                    ? new Date(pkg.createdAt).toLocaleDateString("vi-VN")
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
                            <h2 className="text-xl font-bold text-gray-800">Thêm gói dịch vụ</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tên gói</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập tên gói"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Giá</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập giá"
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
                        setEditingPackage(null);
                        setFormData({ name: "", price: "" });
                    }}
                >
                    <div
                        className="animate-in slide-in-from-top-8 relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa gói dịch vụ</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingPackage(null);
                                    setFormData({ name: "", price: "" });
                                }}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tên gói</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập tên gói"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Giá</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Nhập giá"
                                />
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
