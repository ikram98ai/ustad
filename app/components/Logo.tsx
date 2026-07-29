import { useId } from "react";

interface Props {
  size?: number;
  className?: string;
}

const Logo = ({ size = 32, className }: Props) => {
  const id = useId();
  const helmetCut = `${id}-helmet-cut`;
  const wrenchCut = `${id}-wrench-cut`;
  const gearCut = `${id}-gear-cut`;

  const wrenchBody = (
    <path
      strokeLinejoin="round"
      strokeLinecap="round"
      d="M 163.8 322.0 A 14 14 0 0 1 153.2 317.2 A 44 44 0 0 0 131.4 303.5 Q 119.1 295.0 104.8 296.3 L 120.0 330.0 A 16 16 0 0 0 104.0 346.0 L 70.3 330.8 Q 69.0 345.1 77.5 357.4 A 44 44 0 0 0 153.2 374.8 A 14 14 0 0 1 163.8 370.0 L 348.2 370.0 A 14 14 0 0 1 358.8 374.8 A 44 44 0 0 0 434.5 357.4 Q 443.0 345.1 441.7 330.8 L 408.0 346.0 A 16 16 0 0 0 392.0 330.0 L 407.2 296.3 Q 392.9 295.0 380.6 303.5 A 44 44 0 0 0 358.8 317.2 A 14 14 0 0 1 348.2 322.0 Z"
    />
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ustad logo"
      role="img"
    >
      <defs>
        <mask id={helmetCut}>
          <rect width="512" height="512" fill="#fff" />
          <polygon points="204,86 222,82 217,200 209,200" fill="#000" />
          <polygon points="290,82 308,86 303,200 295,200" fill="#000" />
        </mask>
        <mask id={wrenchCut}>
          <rect width="512" height="512" fill="#fff" />
          <rect x="194" y="336" width="124" height="20" rx="10" fill="#000" />
        </mask>
        <mask id={gearCut}>
          <rect width="512" height="512" fill="#fff" />
          <g fill="#000" stroke="#000" strokeWidth="26" strokeLinejoin="round">
            {wrenchBody}
            <rect x="100" y="242" width="312" height="44" rx="16" />
            <rect x="130" y="284" width="252" height="36" stroke="none" />
          </g>
        </mask>
      </defs>

      <g fill="#1F3A5F" stroke="#1F3A5F" mask={`url(#${gearCut})`}>
        <path
          fillRule="evenodd"
          d="M 122 346 a 134 134 0 1 0 268 0 a 134 134 0 1 0 -268 0 Z M 160 346 a 96 96 0 1 0 192 0 a 96 96 0 1 0 -192 0 Z"
        />
        <g strokeLinejoin="round" strokeWidth="8">
          <path d="M 348.1 434.9 L 363.1 464.9 L 331.1 487.3 L 308.1 462.9 Z" />
          <path d="M 280.4 471.6 L 275.5 504.8 L 236.5 504.8 L 231.6 471.6 Z" />
          <path d="M 203.9 462.9 L 180.9 487.3 L 148.9 464.9 L 163.9 434.9 Z" />
        </g>
      </g>

      <g
        fill="#1E9BD7"
        stroke="#1E9BD7"
        strokeWidth="8"
        mask={`url(#${wrenchCut})`}
      >
        {wrenchBody}
      </g>

      <g fill="#FFD100" mask={`url(#${helmetCut})`}>
        <path d="M 116 246 C 116 162 176 104 256 104 C 336 104 396 162 396 246 Z" />
        <rect x="222" y="82" width="68" height="114" rx="16" />
        <rect x="100" y="242" width="312" height="44" rx="16" />
      </g>
    </svg>
  );
};

export default Logo;
