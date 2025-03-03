import React from "react";
// AI made
interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    color?: string;
    speed?: "slow" | "normal" | "fast";
}

const sizeMap = {
    sm: "w-6 h-6 border-2",
    md: "w-6 h-6 border-4",
    lg: "w-10 h-10 border-4",
};

const speedMap = {
    slow: "animate-spin-slow",
    normal: "animate-spin",
    fast: "animate-spin-fast",
};

const Spinner: React.FC<SpinnerProps> = ({
    size = "md",
    color = "border-gray-500",
    speed = "normal",
}) => {
    return (
        <div
            className={`rounded-full border-t-transparent ${sizeMap[size]} ${speedMap[speed]} ${color}`}
        ></div>
    );
};

export default Spinner;