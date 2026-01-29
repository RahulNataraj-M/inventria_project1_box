import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className={cn(className)}
        fill="none"
    >
        <defs>
            <linearGradient id="grad-left-flap" x1="128" y1="40" x2="43.6211" y2="81.7126" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFA500"/>
                <stop offset="1" stopColor="#F97316"/>
            </linearGradient>
            <linearGradient id="grad-right-flap" x1="128" y1="40" x2="212.379" y2="81.7126" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFC500"/>
                <stop offset="1" stopColor="#FB923C"/>
            </linearGradient>

            <filter id="filter0_d_1_2" x="35.6211" y="36" width="184.758" height="206.697" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="4"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_2"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_2" result="shape"/>
            </filter>
        </defs>
        <g filter="url(#filter0_d_1_2)">
            {/* Box Exterior - Dark Gray */}
            <path d="M43.6211 81.7126L102.733 114.35V234.697L43.6211 202.046V81.7126Z" fill="#3D3D3D"/>
            <path d="M153.253 114.35L212.379 81.7126V202.046L153.253 234.697V114.35Z" fill="#2E2E2E"/>

            {/* Box Interior - Orange */}
            <path d="M102.733 114.35L153.253 114.35L128 129.83L102.733 114.35Z" fill="#EA580C" />
            <path d="M43.6211 81.7126L102.733 114.35L128 129.83L128 40L43.6211 81.7126Z" fill="#FB923C"/>
            <path d="M153.253 114.35L212.379 81.7126L128 40L128 129.83L153.253 114.35Z" fill="#F97316"/>

            {/* Top Flaps - Gradient Orange */}
            <path d="M102.747 114.35L43.6211 81.7126L128 40Z" fill="url(#grad-left-flap)"/>
            <path d="M153.253 114.35L212.379 81.7126L128 40Z" fill="url(#grad-right-flap)"/>

            {/* Center diamond to clean up flap intersection */}
            <path d="M102.733 114.35L128 100.165L153.253 114.35L128 129.83L102.733 114.35Z" fill="#FB923C"/>
        </g>
    </svg>
);