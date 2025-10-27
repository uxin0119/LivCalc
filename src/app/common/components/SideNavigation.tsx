"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon_kebab from "@/app/common/icon/icon_kebab";

interface pagesProps {
    url: string;
    name: string;
    selected: boolean;
}

export default function Sidebar() {
    const pages: pagesProps[] = [
        { url: "/livingcalculator", name: "생활비 계산기", selected: false },
        { url: "/uitest", name: "Ui Test", selected: false },
        { url: "/functiontest", name: "Function Test", selected: false },
        { url: "/game", name: "GAME", selected: false },
        { url: "/escape-from-terminov", name: "Escape From Terminov", selected: false },
        { url: "/auto-log", name: "AUTO_LOG", selected: false },
        { url: "/colortokens", name: "Color Tokens", selected: false },
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

                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">내 앱</div>
                    </div>
                    <nav>
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