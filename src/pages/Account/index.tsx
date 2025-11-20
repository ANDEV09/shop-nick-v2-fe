import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/context/AuthContext";
import { formatNumber } from "~/utils/functions";

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState("info");
    const navigate = useNavigate();
    const { user } = useAuth();

    // States for user profile
    const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // States for purchase history
    const [purchaseHistory, setPurchaseHistory] = useState<Array<Record<string, unknown>>>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    // States for service orders
    const [serviceOrders, setServiceOrders] = useState<Array<Record<string, unknown>>>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    // Fetch user profile when component mounts or when info tab is active
    useEffect(() => {
        if (user?.access_token && (activeTab === "info" || !userProfile)) {
            fetchUserProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, user]);

    // Fetch purchase history when history tab is active
    useEffect(() => {
        if (activeTab === "history" && user?.access_token) {
            fetchPurchaseHistory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, user]);

    // Fetch service orders when orders tab is active
    useEffect(() => {
        if (activeTab === "orders" && user?.access_token) {
            fetchServiceOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, user]);

    const fetchUserProfile = async () => {
        try {
            setLoadingProfile(true);
            setProfileError(null);

            const response = await fetch("http://localhost:8000/auth/profile", {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setUserProfile(data.result);
            } else {
                setProfileError(data.message || "Không thể tải thông tin tài khoản");
            }
        } catch (error) {
            setProfileError(error instanceof Error ? error.message : "Có lỗi xảy ra");
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchPurchaseHistory = async () => {
        try {
            setLoadingHistory(true);
            setHistoryError(null);

            const response = await fetch("http://localhost:8000/game-accounts/my-purchased", {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const items =
                    data?.result?.data && Array.isArray(data.result.data)
                        ? data.result.data
                        : Array.isArray(data.result)
                          ? data.result
                          : [];
                setPurchaseHistory(items);
            } else {
                setHistoryError(data.message || "Không thể tải lịch sử mua");
            }
        } catch (error) {
            setHistoryError(error instanceof Error ? error.message : "Có lỗi xảy ra");
        } finally {
            setLoadingHistory(false);
        }
    };

    const fetchServiceOrders = async () => {
        try {
            setLoadingOrders(true);
            setOrdersError(null);

            const response = await fetch("http://localhost:8000/orders/my-orders", {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const items = Array.isArray(data.result) ? data.result : [];
                setServiceOrders(items);
            } else {
                setOrdersError(data.message || "Không thể tải lịch sử đặt dịch vụ");
            }
        } catch (error) {
            setOrdersError(error instanceof Error ? error.message : "Có lỗi xảy ra");
        } finally {
            setLoadingOrders(false);
        }
    };

    // Tabs cho user
    const tabs = [
        { id: "info", label: "Thông tin tài khoản" },
        { id: "history", label: "Lịch sử mua nick" },
        { id: "orders", label: "Lịch sử đặt dịch vụ" },
    ];

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="container mx-auto my-8 flex flex-col gap-6 lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full rounded-lg bg-white p-5 shadow-md lg:w-1/4">
                <div className="mb-6 flex flex-col items-center">
                    <img
                        src="https://www.creocommunity.com/wp-content/uploads/2024/05/League-of-Legends-Decouvrez-le-magnifique-skin-Hall-of-768x432.jpg"
                        alt={String(userProfile?.username ?? "User")}
                        className="mb-2 h-24 w-24 rounded-full object-cover shadow-sm"
                    />
                    <h2 className="text-xl font-semibold">
                        {String(userProfile?.username ?? user?.name ?? "Người dùng")}
                    </h2>
                    <span className="text-sm text-gray-500">
                        {userProfile?.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                    </span>
                </div>
                <ul className="flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <li key={tab.id}>
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full cursor-pointer rounded-lg px-4 py-2 text-left transition-colors duration-300 ${
                                    activeTab === tab.id
                                        ? "bg-blue-500 font-semibold text-white shadow"
                                        : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                                }`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Content */}
            <section className="w-full rounded-lg bg-white p-6 shadow-md transition-all duration-300 lg:w-3/4">
                {/* User Info */}
                {activeTab === "info" && (
                    <div className="space-y-4">
                        <h3 className="mb-3 text-2xl font-semibold">Thông tin cá nhân</h3>

                        {loadingProfile ? (
                            <div className="flex justify-center py-8">
                                <p className="text-gray-500">Đang tải...</p>
                            </div>
                        ) : profileError ? (
                            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                <p>{profileError}</p>
                            </div>
                        ) : !userProfile ? (
                            <div className="rounded border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
                                <p>Không thể tải thông tin tài khoản</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <p className="text-gray-500">Tên đăng nhập</p>
                                    <p className="font-medium">{String(userProfile.username ?? "N/A")}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-medium">{String(userProfile.email ?? "N/A")}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Mật khẩu</p>
                                    <p className="font-medium">••••••••</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Role</p>
                                    <p className="font-medium">
                                        {userProfile.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Số dư</p>
                                    <p className="font-medium text-green-600">
                                        {formatNumber(Number(userProfile.balance ?? 0))} ₫
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Tổng nạp</p>
                                    <p className="font-medium text-blue-600">
                                        {formatNumber(Number(userProfile.totalDeposited ?? 0))} ₫
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Ngày tạo tài khoản</p>
                                    <p className="font-medium">
                                        {userProfile.createdAt ? formatDate(String(userProfile.createdAt)) : "N/A"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Change Password Button */}
                        {userProfile && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => navigate("/change-password")}
                                    className="rounded-lg bg-blue-500 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-600"
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* History */}
                {activeTab === "history" && (
                    <div className="space-y-4">
                        <h3 className="mb-3 text-2xl font-semibold">Lịch sử mua nick</h3>

                        {loadingHistory ? (
                            <div className="flex justify-center py-8">
                                <p className="text-gray-500">Đang tải...</p>
                            </div>
                        ) : historyError ? (
                            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                <p>{historyError}</p>
                            </div>
                        ) : purchaseHistory.length === 0 ? (
                            <div className="rounded border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
                                <p>Chưa có lịch sử mua nick nào.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2 text-left">Tên tài khoản</th>
                                            <th className="border px-4 py-2 text-left">Giá</th>
                                            <th className="border px-4 py-2 text-left">Ngày mua</th>
                                            <th className="border px-4 py-2 text-left">Trạng thái</th>
                                            <th className="border px-4 py-2 text-left">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchaseHistory.map((item, index) => (
                                            <tr key={String(item.id ?? index)} className="hover:bg-gray-50">
                                                <td className="border px-4 py-2">
                                                    <span className="font-medium">
                                                        {String(item.name ?? "Không có tên")}
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <span className="font-semibold text-blue-600">
                                                        {formatNumber(Number(item.price ?? 0))} ₫
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {item.purchasedAt
                                                        ? new Date(String(item.purchasedAt)).toLocaleDateString("vi-VN")
                                                        : item.createdAt
                                                          ? new Date(String(item.createdAt)).toLocaleDateString("vi-VN")
                                                          : "-"}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                                        Đã mua
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <button
                                                        onClick={() => navigate(`/accounts/${String(item.id)}`)}
                                                        className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition hover:bg-blue-600"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Service Orders */}
                {activeTab === "orders" && (
                    <div className="space-y-4">
                        <h3 className="mb-3 text-2xl font-semibold">Lịch sử đặt dịch vụ</h3>

                        {loadingOrders ? (
                            <div className="flex justify-center py-8">
                                <p className="text-gray-500">Đang tải...</p>
                            </div>
                        ) : ordersError ? (
                            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                <p>{ordersError}</p>
                            </div>
                        ) : serviceOrders.length === 0 ? (
                            <div className="rounded border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
                                <p>Chưa có lịch sử đặt dịch vụ nào.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2 text-left">Dịch vụ</th>
                                            <th className="border px-4 py-2 text-left">Gói</th>
                                            <th className="border px-4 py-2 text-left">Tài khoản</th>
                                            <th className="border px-4 py-2 text-left">Giá</th>
                                            <th className="border px-4 py-2 text-left">Ngày đặt</th>
                                            <th className="border px-4 py-2 text-left">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceOrders.map((order, index) => {
                                            const service = order.service as Record<string, unknown> | undefined;
                                            const pkg = order.package as Record<string, unknown> | undefined;
                                            const status = Number(order.status ?? 0);

                                            return (
                                                <tr key={String(order.id ?? index)} className="hover:bg-gray-50">
                                                    <td className="border px-4 py-2">
                                                        <span className="font-medium">
                                                            {service ? String(service.name ?? "N/A") : "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {pkg ? String(pkg.name ?? "N/A") : "N/A"}
                                                    </td>
                                                    <td className="border px-4 py-2 text-sm">
                                                        <div>{String(order.accountName ?? "N/A")}</div>
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <span className="font-semibold text-blue-600">
                                                            {formatNumber(Number(order.price ?? 0))} ₫
                                                        </span>
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {order.createdAt
                                                            ? new Date(String(order.createdAt)).toLocaleDateString(
                                                                  "vi-VN",
                                                              )
                                                            : "-"}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <span
                                                            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                                                status === 1
                                                                    ? "bg-green-100 text-green-800"
                                                                    : status === 2
                                                                      ? "bg-blue-100 text-blue-800"
                                                                      : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {status === 0
                                                                ? "Chờ xử lý"
                                                                : status === 1
                                                                  ? "Đang xử lý"
                                                                  : status === 2
                                                                    ? "Hoàn thành"
                                                                    : "Hủy"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AccountPage;
