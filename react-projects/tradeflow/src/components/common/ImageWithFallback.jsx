import React, { useState, useEffect } from "react";

export default function ImageWithFallback({ 
    src, 
    alt = "Item thumbnail", 
    className = "", 
    placeholderClass = "", 
    icon = "bi bi-box-seam" 
}) {
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
    }, [src]);

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={alt}
                className={className}
                onError={() => setFailed(true)}
            />
        );
    }

    return (
        <div className={placeholderClass}>
            <i className={icon}></i>
        </div>
    );
}
