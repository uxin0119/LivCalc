import React from "react";

interface CSectionProps {
    children: React.ReactNode,
    className?: string
}

const CSection2 = ({children, className}: CSectionProps) => {
    return (
        <div className={`p-4 rounded-md shadow-sm bg-white dark:bg-black ${className}`}>
            {children}
        </div>
    )
}

export default CSection2;