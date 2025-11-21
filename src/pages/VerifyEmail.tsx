import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const VerifyEmailPage = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (!token) return;
        const verify = async () => {
            try {
                const res = await fetch(`http://localhost:8000/auth/verify-email/${token}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setStatus("success");
                    setMessage(data.message || "Xác thực email thành công!");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Xác thực email thất bại!");
                }
            } catch {
                setStatus("error");
                setMessage("Có lỗi xảy ra khi xác thực email!");
            }
        };
        verify();
    }, [token]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">Xác thực Email</h1>
                {status === "pending" && <div className="font-semibold text-blue-600">Đang xác thực...</div>}
                {status === "success" && <div className="mb-2 font-semibold text-green-600">{message}</div>}
                {status === "error" && <div className="mb-2 font-semibold text-red-600">{message}</div>}
                <Link
                    to="/login"
                    className="mt-6 inline-block rounded bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
                >
                    Đăng nhập
                </Link>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
