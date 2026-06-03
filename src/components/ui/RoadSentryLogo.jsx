export const RoadSentryLogo = ({ size = 32, className = "" }) => {
    return (
        <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            className={className}
        >
            <path d="M50 10L90 30V70L50 90L10 70V30L50 10Z" stroke="url(#logo-grad)" strokeWidth="4" strokeLinejoin="round"/>
            <path d="M50 25L80 40V60L50 75L20 60V40L50 25Z" fill="url(#logo-grad)" fillOpacity="0.15" stroke="url(#logo-grad)" strokeWidth="2"/>
            <path d="M50 40V60" stroke="#00F2FE" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="50" cy="31" r="4" fill="#10B981"/>
            <defs>
                <linearGradient id="logo-grad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00F2FE"/>
                    <stop offset="1" stopColor="#4FACFE"/>
                </linearGradient>
            </defs>
        </svg>
    );
};