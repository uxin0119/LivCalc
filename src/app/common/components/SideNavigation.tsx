"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Icon_kebab from "@/app/common/icon/icon_kebab";

interface pagesProps {
    url: string;
    name: string;
    selected: boolean;
}

export default function Sidebar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const pages: pagesProps[] = [
        { url: "/livingcalculator", name: "생활비 계산기", selected: false },
        { url: "/history", name: "자산 기록 달력", selected: false },
    ]

    const [statePages, setStatePages] = useState<pagesProps[]>(pages);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const changePageSelected = (index: number) => {
        const newPages = [...statePages];
        newPages.forEach((page, i) => {
            page.selected = i === index;
        })
        setStatePages(newPages);
        setIsMenuOpen(false); // 모바일에서 메뉴 선택 후 닫기
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        const newPages = [...statePages];
        newPages.forEach((page, i) => {
            page.selected = window.location.pathname === page.url;
        })
        setStatePages(newPages);
    }, []);

    const handleAuthClick = () => {
        if (status === "authenticated") {
            signOut({ callbackUrl: '/' });
        } else {
            router.push('/auth/signin');
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            {/* 오버레이 - 사이드바가 열렸을 때만 표시 */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* 모바일 사이드바 */}
            <div className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 shadow-xl border-r
                border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>

                <div className="flex border-r border-gray-700 bg-gray-900 w-10 h-15 rounded-2xl absolute right-[-25] top-[45%] z-20" onClick={toggleMenu}>
                    <Icon_kebab className={"ml-2"}/>
                </div>

                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-xl font-bold text-white">내 앱</div>
                        <div className="flex items-center gap-2">
                            {/* 로그인/로그아웃 버튼 */}
                            <button
                                onClick={handleAuthClick}
                                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                title={status === "authenticated" ? "로그아웃" : "로그인"}
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? (
                                    <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : status === "authenticated" ? (
                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 사용자 정보 */}
                    {status === "authenticated" && session?.user && (
                        <div className="mb-4 p-3 bg-gray-800 rounded">
                            <p className="text-sm font-medium text-white truncate">
                                {session.user.name || session.user.email}
                            </p>
                            {session.user.name && (
                                <p className="text-xs text-gray-400 truncate">
                                    {session.user.email}
                                </p>
                            )}
                        </div>
                    )}

                    <nav className="flex-1">
                        <ul className="space-y-2">
                            {statePages.map((page, index) => {
                                const linkClassName = `block p-3 rounded transition-colors text-gray-300 hover:bg-gray-800 ${
                                    page.selected
                                        ? 'font-bold bg-gray-800 border-l-4 border-blue-500 text-white'
                                        : ''
                                }`;
                                return (
                                    <li key={index}>
                                        <Link href={page.url} onClick={() => changePageSelected(index)}
                                              className={linkClassName}>
                                            {page.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}