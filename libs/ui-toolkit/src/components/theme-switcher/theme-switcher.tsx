export const ThemeSwitcher = ({
  onToggle,
  className,
}: {
  onToggle: () => void;
  className?: string;
}) => (
  <button type="button" onClick={() => onToggle()} className={className}>
    <span className="dark:hidden text-black">
      <svg viewBox="0 0 45 45" className="w-32 h-32">
        <g>
          <path
            d="M22.5 27.79a5.29 5.29 0 1 0 0-10.58 5.29 5.29 0 0 0 0 10.58Z"
            fill="currentColor"
          ></path>
          <path
            d="M15.01 22.5H10M35 22.5h-5.01M22.5 29.99V35M22.5 10v5.01M17.21 27.79l-3.55 3.55M31.34 13.66l-3.55 3.55M27.79 27.79l3.55 3.55M13.66 13.66l3.55 3.55"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeMiterlimit="10"
          ></path>
        </g>
      </svg>
    </span>
    <span className="hidden dark:inline text-white">
      <svg viewBox="0 0 45 45" className="w-32 h-32">
        <path
          d="M28.75 11.69A12.39 12.39 0 0 0 22.5 10a12.5 12.5 0 1 0 0 25c2.196 0 4.353-.583 6.25-1.69A12.46 12.46 0 0 0 35 22.5a12.46 12.46 0 0 0-6.25-10.81Zm-6.25 22a11.21 11.21 0 0 1-11.2-11.2 11.21 11.21 0 0 1 11.2-11.2c1.246 0 2.484.209 3.66.62a13.861 13.861 0 0 0-5 10.58 13.861 13.861 0 0 0 5 10.58 11.078 11.078 0 0 1-3.66.63v-.01Z"
          fill="currentColor"
        ></path>
      </svg>
    </span>
  </button>
);
