import React from "react";

interface CSectionProps {
    children: React.ReactNode,
    className?: string
}

const CSection1 = ({children, className}: CSectionProps) => {
    return (
        <div className={`p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700 ${className}`}>
            {children}
        </div>
    )
}

export default CSection1;