"use client";

import React from "react";
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
