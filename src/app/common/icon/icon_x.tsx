import React from "react";

interface IconProps {
    className?: string;
}

const IconX: React.FC<IconProps> = ({ className }) => {
    const defaultClass = "w-6 h-6";
    const finalClassName = className ? className : defaultClass;

    return (
        <svg className={finalClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
};

export default IconX;