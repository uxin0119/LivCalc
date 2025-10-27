import React from "react";

interface IconGearProps {
    width?: number;
    height?: number;
    className?: string;
    fill?: string;
}

const IconGrabbable:React.FC<IconGearProps> = ({
                                                   width = 16,
                                                   height = 16,
                                                   className = "",
                                                   fill = "currentColor"
                                               }) =>{
    return (
        <svg width={width} height={height}
             className={className}
             fill={fill}
             viewBox="0 0 16 16">
            <circle cx="3" cy="3" r="1"/>
            <circle cx="3" cy="8" r="1"/>
            <circle cx="3" cy="13" r="1"/>
            <circle cx="8" cy="3" r="1"/>
            <circle cx="8" cy="8" r="1"/>
            <circle cx="8" cy="13" r="1"/>
        </svg>
    )
}

export default IconGrabbable;