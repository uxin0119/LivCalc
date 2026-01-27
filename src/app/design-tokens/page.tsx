"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DesignTokens } from "@/app/common/tokens/DesignTokens";
import { TokenStyles } from "@/app/common/tokens/TokenStyles";
import CButton from "@/app/common/ui/CButton";
import CInput from "@/app/common/ui/CInput";
import CTextarea from "@/app/common/ui/CTextarea";

const TokenSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-700">{title}</h2>
    {children}
  </div>
);

const ColorSwatch = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-24 h-24 rounded-lg shadow-md mb-2 border border-gray-700"
      style={{ backgroundColor: value }}
    />
    <span className="text-sm font-medium">{name}</span>
    <span className="text-xs text-gray-500">{value}</span>
  </div>
);

const DesignTokensPage = () => {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      checkAdmin();
    } else if (status === 'unauthenticated') {
      setLoading(false); // 로딩 끝, 로그인 필요 화면 등은 아래에서 처리 (현재는 accessDenied로 통일 가능)
    }
  }, [status]);

  const checkAdmin = async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      
      if (result.isAdmin) {
        setAccessDenied(false);
      } else {
        setAccessDenied(true);
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setAccessDenied(true);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-400">
            로딩 중...
        </div>
    );
  }

  if (status === 'unauthenticated' || accessDenied) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 text-center">
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Design System</h1>

      {/* 1. Colors */}
      <TokenSection title="Colors">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Gray Scale</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(DesignTokens.colors.gray).map(([key, value]) => (
                <ColorSwatch key={key} name={`gray-${key}`} value={value} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Semantic Colors (Light Mode)</h3>
            <div className="flex flex-wrap gap-4">
              <ColorSwatch name="Primary Text" value={DesignTokens.colors.light.text.primary} />
              <ColorSwatch name="Background" value={DesignTokens.colors.light.background.primary} />
              <ColorSwatch name="Danger" value={DesignTokens.colors.semantic.danger.light} />
            </div>
          </div>

           <div>
            <h3 className="text-xl font-semibold mb-4">Semantic Colors (Dark Mode)</h3>
            <div className="flex flex-wrap gap-4">
              <ColorSwatch name="Primary Text" value={DesignTokens.colors.dark.text.primary} />
              <ColorSwatch name="Background" value={DesignTokens.colors.dark.background.primary} />
              <ColorSwatch name="Danger" value={DesignTokens.colors.semantic.danger.dark} />
            </div>
          </div>
        </div>
      </TokenSection>

      {/* 2. Typography */}
      <TokenSection title="Typography">
        <div className="space-y-4">
          <div className={TokenStyles.common.text.head1}>Head 1: The quick brown fox jumps over the lazy dog</div>
          <div className={TokenStyles.common.text.head2}>Head 2: The quick brown fox jumps over the lazy dog</div>
          <div className={TokenStyles.common.text.primary}>Primary: The quick brown fox jumps over the lazy dog</div>
          <div className={TokenStyles.common.text.secondary}>Secondary: The quick brown fox jumps over the lazy dog</div>
          <div className={TokenStyles.common.text.body1}>Body 1: The quick brown fox jumps over the lazy dog</div>
          <div className={TokenStyles.common.text.body2}>Body 2: The quick brown fox jumps over the lazy dog</div>
        </div>
      </TokenSection>

      {/* 3. Components */}
      <TokenSection title="Components">
        <div className="space-y-8">
          
          {/* Buttons */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Buttons</h3>
            <div className="flex gap-4 items-center flex-wrap">
              <CButton variant="primary">Primary Button</CButton>
              <CButton variant="secondary">Secondary Button</CButton>
              <CButton variant="danger">Danger Button</CButton>
              <CButton variant="primary" disabled>Disabled</CButton>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <CInput value="" onChange={() => {}} placeholder="Default Input" />
              <CInput value="Filled Value" onChange={() => {}} />
              <CInput value="" onChange={() => {}} placeholder="Disabled Input" disabled />
            </div>
          </div>

           {/* Textarea */}
           <div>
            <h3 className="text-xl font-semibold mb-4">Textarea</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <CTextarea value="" onChange={() => {}} placeholder="Default Textarea" />
              <CTextarea value="Filled Value" onChange={() => {}} />
            </div>
          </div>

        </div>
      </TokenSection>

       {/* 4. Living Calculator Styles */}
       <TokenSection title="Living Calculator Styles">
         <div className="space-y-6">
            <div className={TokenStyles.livingCalculator.container + " p-6"}>
                <h3 className={TokenStyles.livingCalculator.title}>Calculator Container</h3>
                <p className={TokenStyles.livingCalculator.subtitle}>Subtitle style</p>
                <div className="mt-4">
                    <div className={TokenStyles.livingCalculator.card.active + " p-4"}>Active Card Style</div>
                    <div className={TokenStyles.livingCalculator.card.inactive + " p-4 text-white"}>Inactive Card Style</div>
                </div>
                <div className="mt-4 flex gap-4">
                     <div className={TokenStyles.livingCalculator.sectionTotal.positive}>Positive Total</div>
                     <div className={TokenStyles.livingCalculator.sectionTotal.negative}>Negative Total</div>
                </div>
            </div>
         </div>
       </TokenSection>

    </div>
  );
};

export default DesignTokensPage;
