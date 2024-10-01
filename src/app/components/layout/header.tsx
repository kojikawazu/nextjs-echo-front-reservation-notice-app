'use client';

import React from 'react';
import Link from 'next/link';
import LogoutButton from '@/app/components/user/logout-btn';

interface HeaderProps {
    username: string;
};

/**
 * ヘッダーコンポーネント
 * @param username
 * @returns JSX
 */
const Header = ({
    username,
}: HeaderProps) => {
    return (
        <header className="bg-blue-500 p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-lg font-bold">予約システム</h1>
                <ul className="flex space-x-4">
                    
                    <li>
                        <Link href="/reservation/form">
                            <a className="text-white hover:underline">予約フォーム</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/reservation">
                            <a className="text-white hover:underline">予約リスト</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/notification">
                            <a className="text-white hover:underline">予約通知リスト</a>
                        </Link>
                    </li>
                    <li>
                        <span className="text-white">{username} さん</span>
                    </li>
                    <li>
                        <LogoutButton />
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;