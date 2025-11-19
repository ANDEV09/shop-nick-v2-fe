import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

export default function AccountDetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const stateAccount = (location.state as any)?.account as Record<string, unknown> | undefined;

    const [account, setAccount] = useState<Record<string, unknown> | null>(stateAccount ?? null);
    const [loading, setLoading] = useState(!stateAccount);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (account || !id) return;
        const controller = new AbortController();

        (async function load() {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8000/game-accounts/${id}`, { signal: controller.signal });
                const data = await res.json();

                let acc = null as any;

                if (data?.result && !Array.isArray(data.result)) acc = data.result;
                else if (data?.result?.data && Array.isArray(data.result.data)) acc = data.result.data[0];
                else if (data?.data && !Array.isArray(data.data)) acc = data.data;
                else acc = data?.result ?? data?.data ?? null;

                setAccount(acc);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [id, account]);

    // -------------------------
    // Xử lý images
    // -------------------------
    function parseImages(a: Record<string, unknown> | null) {
        if (!a) return [];
        const images = a["images"] ?? a["imgs"] ?? a["thumbnails"];
        if (!images) return [];

        if (Array.isArray(images))
            return images
                .map(String)
                .map((s) => s.trim())
                .filter(Boolean);

        if (typeof images === "string") {
            // try parse as JSON array first
            try {
                const parsed = JSON.parse(images);
                if (Array.isArray(parsed))
                    return parsed
                        .map(String)
                        .map((s) => s.trim())
                        .filter(Boolean);
            } catch {
                // not JSON, continue
            }
            // fallback: split by comma
            return images
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }

        return [];
    }

    function getImageUrl(src?: string) {
        if (!src) return "";
        try {
            if (typeof src !== "string") return "";
            const s = src.trim();
            if (!s) return "";
            if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) return s;
            return "/" + s.replace(/^\/+/, "");
        } catch {
            return "";
        }
    }

    const imgs = parseImages(account);

    return (
        <div className="min-h-screen bg-[#0f1426] px-4 py-6 text-white">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#00c8ff]">🎮 Chi tiết tài khoản</h1>
                </div>

                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p className="text-red-500">Lỗi: {error}</p>
                ) : !account ? (
                    <p>Không tìm thấy tài khoản.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Left: Thumbnail */}
                        <div className="md:col-span-1">
                            <div className="overflow-hidden rounded-xl border border-[#2a3150] bg-[#1a1f3a] shadow-lg">
                                <img
                                    src={String(account["thumb"] ?? account.thumb ?? "")}
                                    alt="thumb"
                                    className="h-64 w-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="space-y-5 md:col-span-2">
                            <div className="rounded-xl border border-[#2a3150] bg-[#1a1f3a] p-5 shadow-lg">
                                <h2 className="text-xl font-bold text-[#00c8ff]">
                                    {String(account["accountName"] ?? "")}
                                </h2>

                                <p className="mt-3 text-lg">
                                    <strong className="text-[#b0b8d4]">Giá:</strong>{" "}
                                    <span className="font-bold text-[#00c8ff]">
                                        {String(account["price"] ?? "0")} ₫
                                    </span>
                                </p>

                                <p className="mt-3">
                                    <strong className="text-[#b0b8d4]">Mật khẩu:</strong>{" "}
                                    <span className="font-mono">{String(account["password"] ?? "")}</span>
                                </p>

                                {/* Details JSON */}
                                <div className="mt-4">
                                    <strong className="text-[#b0b8d4]">Thông tin chi tiết:</strong>
                                    <pre className="mt-2 rounded-lg border border-[#2a3150] bg-[#0f1426] p-4 text-sm whitespace-pre-wrap text-[#d1d5db]">
                                        {JSON.stringify(account["details"] ?? {}, null, 2)}
                                    </pre>
                                </div>

                                {/* Extra images */}
                                {imgs.length > 0 && (
                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        {imgs.map((url, i) => (
                                            <img
                                                key={i}
                                                src={getImageUrl(url) || "/images/default-card.png"}
                                                alt={`img-${i}`}
                                                className="h-28 w-full rounded-lg border border-[#2a3150] object-cover"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    if (!img || typeof img.src !== "string") return;
                                                    if (img.src.includes("default-card.png")) return;
                                                    img.src = "/images/default-card.png";
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
