import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/app/components/layout/header';

// LogoutButtonコンポーネントをモックする
jest.mock('@/app/components/user/logout-btn', () => {
    return () => <button>Logout</button>;
});

describe('Header', () => {
    const username = '田中';

    beforeEach(() => {
        render(<Header username={username} />);
    });

    it('displays the username', () => {
        expect(screen.getByText('田中 さん')).toBeInTheDocument();
    });

    it('contains a link to the reservation form', () => {
        const linkElement = screen.getByText('予約フォーム');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest('a')).toHaveAttribute(
            'href',
            '/reservation/form'
        );
    });

    it('contains a link to the reservation list', () => {
        const linkElement = screen.getByText('予約リスト');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest('a')).toHaveAttribute(
            'href',
            '/reservation'
        );
    });

    it('contains a link to the notification list', () => {
        const linkElement = screen.getByText('予約通知リスト');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest('a')).toHaveAttribute(
            'href',
            '/notification'
        );
    });

    it('renders the LogoutButton', () => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
});
