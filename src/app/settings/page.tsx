"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';
import CButton from '@/app/common/ui/CButton';
import CInput from '@/app/common/ui/CInput';
import CSelect from '@/app/common/ui/CSelect';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [settings, setSettings] = useState({
        calendar_retention_period: '2',
        admin_email: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchSettings();
        }
    }, [status]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/settings');
            const result = await response.json();
            
            if (result.isAdmin) {
                setSettings({
                    calendar_retention_period: result.settings.calendar_retention_period || '2',
                    admin_email: result.settings.admin_email || ''
                });
                setIsAdmin(true);
                setAccessDenied(false);
            } else {
                setIsAdmin(false);
                setAccessDenied(true);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });

            if (response.ok) {
                alert('설정이 저장되었습니다.');
                fetchSettings();
            } else {
                const err = await response.json();
                alert(`저장 실패: ${err.error || '알 수 없는 오류'}`);
            }
        } catch (error) {
            console.error('Save settings error:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
                로그인이 필요한 서비스입니다.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
                로딩 중...
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="container mx-auto max-w-2xl py-20 px-4 text-center">
                <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">접근 권한이 없습니다</h2>
                    <p className="text-gray-400">
                        이 페이지는 관리자 전용 페이지입니다.<br/>
                        관리자 계정으로 로그인해 주세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-8 px-4">
            <div className="mb-8">
                <h1 className={`${TokenStyles.livingCalculator.title} mb-2`}>사이트 설정</h1>
                <p className="text-gray-400">관리자 전용 시스템 설정을 관리합니다.</p>
            </div>

            <div className={`${TokenStyles.livingCalculator.container} p-6 sm:p-8 space-y-8`}>
                
                {/* 데이터 정리 주기 설정 */}
                <div className="space-y-4">
                    <h3 className={TokenStyles.common.text.head2}>데이터 관리</h3>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">달력 데이터 정리 주기</label>
                        <div className="flex items-center gap-3">
                            <CSelect
                                value={settings.calendar_retention_period}
                                onChange={(val) => setSettings({ ...settings, calendar_retention_period: val })}
                                options={[
                                    { value: '1', label: '1개월' },
                                    { value: '2', label: '2개월' },
                                    { value: '3', label: '3개월' },
                                    { value: '6', label: '6개월' },
                                    { value: '12', label: '1년' },
                                ]}
                                disabled={!isAdmin}
                                className="w-full md:w-48 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            * 설정된 기간이 지난 기록 및 메모는 자동으로 삭제됩니다.
                        </p>
                    </div>
                </div>

                <hr className="border-gray-800" />

                {/* 관리자 설정 */}
                <div className="space-y-4">
                    <h3 className={TokenStyles.common.text.head2}>권한 관리</h3>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">관리자 계정 이메일</label>
                        <CInput
                            type="text"
                            value={settings.admin_email}
                            onChange={(val) => setSettings({ ...settings, admin_email: val })}
                            placeholder="example@gmail.com"
                            disabled={!isAdmin}
                            className="w-full bg-gray-900 border-gray-700 text-white"
                        />
                        {!settings.admin_email && (
                            <p className="text-xs text-blue-400 mt-2">
                                * 현재 관리자가 설정되어 있지 않습니다. 지금 설정하면 관리자 권한을 가집니다.
                            </p>
                        )}
                        {isAdmin && settings.admin_email && (
                            <p className="text-xs text-green-400 mt-2">
                                * 당신은 현재 관리자입니다.
                            </p>
                        )}
                        {!isAdmin && (
                            <p className="text-xs text-red-400 mt-2">
                                * 당신은 관리자가 아닙니다. 설정을 변경할 수 없습니다.
                            </p>
                        )}
                    </div>
                </div>

                {/* 저장 버튼 */}
                {isAdmin && (
                    <div className="pt-4">
                        <CButton
                            variant="primary"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-3"
                        >
                            {isSaving ? '저장 중...' : '설정 저장'}
                        </CButton>
                    </div>
                )}
            </div>
        </div>
    );
}
