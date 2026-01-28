// components/Modal.tsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TokenStyles } from "@/app/common/tokens/TokenStyles";
import CButton from "@/app/common/ui/CButton";
import Icon_x from "@/app/common/icon/icon_x";

/**
 * 모달 자체 프롭 인터페이스
 */
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '70' | 'full';
}

/**
 * modal을 사용하는 모든 클래스의 인터페이스
 */
export interface openCloseRef{
    open: () => void;
    close: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {

    /**
     * 최초 로드시
     */
    useEffect(() => {
        /**
         * esc로 모달 닫기
         * @param event
         */
        const handleEsc = (event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };

        /**
         * 모달 열려있을경우 스크롤 방지
         */
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // 모달이 열릴 때 body 스크롤 방지 및 스크롤바 너비 보정
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        }

        /**
         * 모달 닫힐경우 이벤트 초기화
         */
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    /**
     * 사이즈 사전정의
     */
    const sizeClasses = {
        sm: 'max-w-xs sm:max-w-sm',
        md: 'max-w-sm sm:max-w-md',
        lg: 'max-w-md sm:max-w-lg',
        xl: 'max-w-lg sm:max-w-xl',
        '70': 'w-[70%]',
        full: 'w-[95%] max-w-full'
    };

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-1 sm:p-4 pt-4 sm:pt-4">
            {/* 오버레이 - 다른 방식으로 투명도 설정 */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* 모달 컨텐츠 */}
            <div className={`relative rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[96vh] sm:max-h-[90vh] overflow-y-auto`+' '+TokenStyles.common.background.primary}>
                {/* 헤더 */}
                {title && (
                    <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200">
                        <h3 className="text1 text-sm sm:text-base truncate flex-1 mr-2">{title}</h3>
                        <CButton onClick={onClose} variant="primary" size="sm" className="flex-shrink-0">
                            <Icon_x/>
                        </CButton>
                    </div>
                )}

                {/* 바디 */}
                <div className="p-2 sm:p-4">
                    {children}
                </div>
            </div>
        </div>
    );

    // Portal을 사용하여 body에 직접 렌더링
    return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;