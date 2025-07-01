import { IconProps } from "../utils/types";

const UsdtTrc20: React.FC<IconProps> = ({ size = 24, className = "" }) => {
    const svgSize = `${size}px`;

    // Colors - Dogecoin palette
    const mainColor = "#F2A900"; // Dogecoin gold
    const darkColor = "#CB8D00"; // Darker gold
    const lightColor = "#FFD166"; // Lighter gold

    return (
        <svg 
            version="1.2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 660 660" 
            className={className} 
            height={svgSize} 
            width={svgSize}
        >
            {/* Base coin structure */}
            <g id="Object">
                <g id="coin-base">
                    <g id="layers">
                        <g id="outer-circle">
                            <path id="base" fill={mainColor} d="m12.5 330c0-175.4 142.1-317.5 317.5-317.5 175.4 0 317.5 142.1 317.5 317.5 0 175.4-142.1 317.5-317.5 317.5-175.4 0-317.5-142.1-317.5-317.5z" />
                        </g>
                        <g id="inner-circle">
                            <path id="inner" fill={lightColor} d="m60.5 330c0-148.8 120.7-269.5 269.5-269.5 148.8 0 269.5 120.7 269.5 269.5 0 148.8-120.7 269.5-269.5 269.5-148.8 0-269.5-120.7-269.5-269.5z" />
                        </g>
                        <g id="highlight">
                            <path id="shine" fill={darkColor} d="m107.7 354.7c0-131.4 106.5-237.9 237.9-237.9 76.8 0 145.1 36.4 188.6 92.9-41.1-71.3-118.1-119.4-206.3-119.4-131.4 0-237.9 106.5-237.9 237.9 0 54.6 18.4 104.9 49.4 145-20.2-34.9-31.7-75.4-31.7-118.5z" />
                        </g>
                    </g>
                </g>
            </g>

            {/* Dogecoin "D" letter */}
            <path
                d="M220 180h120c66 0 120 54 120 135s-54 135-120 135H220V180zm60 60v150h60c33 0 60-33 60-75s-27-75-60-75h-60z"
                fill="white"
                stroke="white"
                strokeWidth="5"
            />
        </svg>
    );
};

export default UsdtTrc20;