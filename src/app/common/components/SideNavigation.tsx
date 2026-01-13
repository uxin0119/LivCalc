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
    ]

    const [statePages, setStatePages] = useState<pagesProps[]>(pages);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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

        // 다크모드 초기값 설정
        const isDark = localStorage.getItem('darkMode') === 'true' ||
                      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', String(newDarkMode));

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

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
            <div className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 shadow-xl border-r
                border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>

                <div className="flex border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-10 h-15 rounded-2xl absolute right-[-25] top-[45%] z-20" onClick={toggleMenu}>
                    <Icon_kebab className={"ml-2"}/>
                </div>

                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">내 앱</div>
                        <div className="flex items-center gap-2">
                            {/* 다크모드 토글 */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title={isDarkMode ? "라이트 모드" : "다크 모드"}
                            >
                                {isDarkMode ? (
                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            {/* 로그인/로그아웃 버튼 */}
                            <button
                                onClick={handleAuthClick}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title={status === "authenticated" ? "로그아웃" : "로그인"}
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? (
                                    <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : status === "authenticated" ? (
                                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 사용자 정보 */}
                    {status === "authenticated" && session?.user && (
                        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {session.user.name || session.user.email}
                            </p>
                            {session.user.name && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {session.user.email}
                                </p>
                            )}
                        </div>
                    )}

                    <nav className="flex-1">
                        <ul className="space-y-2">
                            {statePages.map((page, index) => {
                                const linkClassName = `block p-3 rounded transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                    page.selected
                                        ? 'font-bold bg-gray-100 dark:bg-gray-800 border-l-4 border-blue-600 dark:border-blue-500 text-gray-900 dark:text-white'
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