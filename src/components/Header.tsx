import clsx from "clsx";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaRegUser, FaFacebookF, FaYoutube } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";
import { formatPhone } from "../utils/functions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import type { ReactNode } from "react";

interface NavLinkType {
    href: string;
    active: boolean;
    children: ReactNode;
}

function NavLink({ href, active, children }: NavLinkType) {
    return (
        <Link
            to={href}
            className={clsx(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition",
                active ? "bg-blue-100 text-blue-600 shadow" : "text-gray-700 hover:bg-gray-100 hover:text-blue-500",
            )}
        >
            <span>{children}</span>
        </Link>
    );
}

const Header = () => {
    const location = useLocation();
    const url = location.pathname;
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownTimeout = useRef<number | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user?.access_token) {
                try {
                    const response = await fetch("http://localhost:8000/auth/profile", {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                        },
                    });

                    const data = await response.json();
                    if (response.ok && data.result) {
                        setUserRole(data.result.role);
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
        };

        fetchUserRole();
    }, [user]);

    return (
        <>
            <div className="container-content hidden items-center justify-between py-4 md:flex xl:py-2.5">
                <div className="ht-flex-center mx-4 gap-3 text-xs xl:mx-0">
                    <a
                        href="https://www.facebook.com/phamhoangtuanqn/"
                        target="_blank"
                        className="text-primary hover:bg-primary rounded-full bg-white p-2.5 shadow-sm duration-200 hover:text-white xl:p-1.5"
                    >
                        <FaFacebookF />
                    </a>
                    <a
                        href="https://www.youtube.com/@htuanqn"
                        target="_blank"
                        className="text-primary hover:bg-primary rounded-full bg-white p-2.5 shadow-sm duration-200 hover:text-white xl:p-1.5"
                    >
                        <FaYoutube />
                    </a>
                </div>
                <span className="ht-flex-center gap-0.5 text-sm md:text-base xl:text-sm">
                    <span>Hotline:</span>{" "}
                    <a href="tel:0812665001" className="ht-text-primary">
                        {formatPhone("0812665001")}
                    </a>{" "}
                    <span className="hidden sm:block">(8:00 - 22:00)</span>
                </span>
            </div>

            <header className="ht-background-blur sticky top-2 z-50 mx-4 mb-9 rounded-lg bg-white shadow-xs">
                <div className="container-content mx-auto flex items-center justify-between py-3">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Logo Website" className="h-auto w-34 object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden gap-2 xl:flex">
                        <NavLink href="/" active={url === "/"}>
                            Trang chủ
                        </NavLink>
                        <NavLink href="/thong-tin" active={url === "/thong-tin"}>
                            Lịch sử mua nick
                        </NavLink>
                        <NavLink href="/tin-tuc" active={url === "/tin-tuc"}>
                            Tin tức
                        </NavLink>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="relative hidden gap-3 xl:flex">
                        {user ? (
                            <div className="relative w-44">
                                {/* Avatar + Name */}
                                <div
                                    className="flex w-full cursor-pointer items-center rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100"
                                    onMouseEnter={() => {
                                        if (dropdownTimeout.current) window.clearTimeout(dropdownTimeout.current);
                                        setUserDropdownOpen(true);
                                    }}
                                    onMouseLeave={() => {
                                        dropdownTimeout.current = window.setTimeout(
                                            () => setUserDropdownOpen(false),
                                            200,
                                        );
                                    }}
                                >
                                    <div className="h-6 w-6 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                    <span className="ml-2 flex flex-1 items-center justify-center truncate text-sm">
                                        {user?.username ? String(user.username) : "Người dùng"}
                                    </span>
                                </div>
                                {/* Dropdown */}
                                {userDropdownOpen && (
                                    <div
                                        className="absolute right-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
                                        onMouseEnter={() => {
                                            if (dropdownTimeout.current) window.clearTimeout(dropdownTimeout.current);
                                            setUserDropdownOpen(true);
                                        }}
                                        onMouseLeave={() => {
                                            dropdownTimeout.current = window.setTimeout(
                                                () => setUserDropdownOpen(false),
                                                200,
                                            );
                                        }}
                                    >
                                        <Link
                                            to="/thong-tin"
                                            className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        {userRole === "ADMIN" && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => logout(navigate)}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to={"/login"}
                                    className="ht-flex-center gap-1 rounded-lg border border-blue-500 px-5 py-2 text-center font-semibold text-blue-500 transition hover:bg-blue-50"
                                >
                                    <IoMdLogIn />
                                    <span>Đăng nhập</span>
                                </Link>

                                <Link to="/register">
                                    <Button variant="primary">
                                        <FiUserPlus />
                                        <span>Đăng ký</span>
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger & User */}
                    <div className="flex items-center gap-2 xl:hidden">
                        <Link
                            to={"/login"}
                            className="rounded-full bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                        >
                            <FaRegUser size={22} />
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
