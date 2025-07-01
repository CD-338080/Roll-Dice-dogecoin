import { IconProps } from "../utils/types";

const UsdtTrc20: React.FC<IconProps> = ({ size = 24, className = "" }) => {
    const svgSize = `${size}px`;

    // Colors - Dogecoin palette
    const mainColor = "#F2A900"; // Dogecoin gold
    const darkColor = "#CB8D00"; // Darker gold
    const lightColor = "#FFD166"; // Lighter gold

    return (
        <svg
            width={svgSize}
            height={svgSize}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient
                    id="mainGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor={lightColor} />
                    <stop offset="50%" stopColor={mainColor} />
                    <stop offset="100%" stopColor={darkColor} />
                </linearGradient>

                <filter id="innerShadow">
                    <feOffset dx="0" dy="1" />
                    <feGaussianBlur stdDeviation="1" result="offset-blur" />
                    <feComposite
                        operator="out"
                        in="SourceGraphic"
                        in2="offset-blur"
                        result="inverse"
                    />
                    <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                    <feComposite
                        operator="in"
                        in="color"
                        in2="inverse"
                        result="shadow"
                    />
                    <feComposite
                        operator="over"
                        in="shadow"
                        in2="SourceGraphic"
                    />
                </filter>
            </defs>
            
            {/* Base circle - Dogecoin coin */}
            <circle 
                cx="12" 
                cy="12" 
                r="11.5" 
                fill="url(#mainGradient)"
                filter="url(#innerShadow)"
            />

            {/* Corrected Dogecoin "D" letter */}
            <path
                d="M8 7h4c2.2 0 4 1.8 4 4.5S14.2 16 12 16H8V7zm2 2v5h2c1.1 0 2-1.1 2-2.5S13.1 9 12 9h-2z"
                fill="white"
                stroke="white"
                strokeWidth="0.5"
            />
        </svg>
    );
};

export default UsdtTrc20;