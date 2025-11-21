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
                console.log(res);

                if (res.ok) {
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
        <>
            <form className="mt-8 space-y-5">
                <div>
                    <div className="relative flex flex-col items-center justify-center">
                        {status === "success" && (
                            <>
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpBrFpH2FpYiRsG2DZ1FmeOOHaeixp8tTnfA&s"
                                    className="h-30 w-30"
                                />
                                <h4 className="mt-5 font-bold text-green-500">Đã xác minh tài khoản thành công!</h4>
                            </>
                        )}
                        {status === "error" && (
                            <>
                                <img
                                    src="https://www.freeiconspng.com/thumbs/error-icon/error-icon-4.png"
                                    className="h-30 w-30"
                                />
                                <h4 className="mt-5 font-bold text-red-500">Đã xảy ra lỗi trong quá trình xác thực!</h4>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
};

export default VerifyEmailPage;
