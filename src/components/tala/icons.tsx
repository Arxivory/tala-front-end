import type { SVGProps } from "react";

/**
 * Custom rounded line-icon set for TALA. Single consistent stroke style,
 * 24x24 grid, currentColor stroke — deliberately not an off-the-shelf pack.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 22, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 11.2 12 4.5l8 6.7" />
    <path d="M6 10.8V19h12v-8.2" />
    <path d="M10 19v-4.4h4V19" />
  </Base>
);

export const IconTwin = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="5" r="2.2" />
    <path d="M12 7.2v6.1" />
    <path d="M7.6 9.6 12 8.4l4.4 1.2" />
    <path d="M12 13.3 9.2 20M12 13.3 14.8 20" />
  </Base>
);

export const IconChat = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 6.6h14a1.6 1.6 0 0 1 1.6 1.6v6.2A1.6 1.6 0 0 1 19 16H12l-4.4 3v-3H5a1.6 1.6 0 0 1-1.6-1.6V8.2A1.6 1.6 0 0 1 5 6.6Z" />
    <path d="M8.4 11.3h7.2" />
  </Base>
);

export const IconPulse = (p: IconProps) => (
  <Base {...p}>
    <path d="M3.4 12h3.2l2-4.4 3 9 2.2-4.6h6.8" />
  </Base>
);

export const IconBone = (p: IconProps) => (
  <Base {...p}>
    <path d="M8.6 15.4 15.4 8.6" />
    <path d="M6.2 13.2a2.1 2.1 0 1 0 2.4 2.4 2.1 2.1 0 1 0 2.4 2.4" />
    <path d="M17.8 10.8a2.1 2.1 0 1 0-2.4-2.4A2.1 2.1 0 1 0 13 6" />
  </Base>
);

export const IconCamera = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 8.4h8.6a1.4 1.4 0 0 1 1.4 1.4v4.4a1.4 1.4 0 0 1-1.4 1.4H4a1.4 1.4 0 0 1-1.4-1.4V9.8A1.4 1.4 0 0 1 4 8.4Z" />
    <path d="m14 12 5.4-2.6v5.2L14 12" />
  </Base>
);

export const IconGravity = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <ellipse cx="12" cy="12" rx="9" ry="4.2" transform="rotate(-24 12 12)" />
  </Base>
);

export const IconSync = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.6 10.4a7.4 7.4 0 0 1 12.6-3.1l1.9 1.9" />
    <path d="M19.4 13.6a7.4 7.4 0 0 1-12.6 3.1l-1.9-1.9" />
    <path d="M19.1 5.4v3.8h-3.8M4.9 18.6v-3.8h3.8" />
  </Base>
);

export const IconFleet = (p: IconProps) => (
  <Base {...p}>
    <circle cx="8" cy="8.4" r="2.2" />
    <circle cx="16.4" cy="8.4" r="2.2" />
    <path d="M3.6 18.2c0-2.4 2-4 4.4-4s4.4 1.6 4.4 4" />
    <path d="M13.8 14.6c2.3-.5 6.6.4 6.6 3.6" />
  </Base>
);

export const IconChart = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 19V5" />
    <path d="M4 19h16" />
    <path d="M7.4 15.4 11 11l3 2.4 3.6-5.2" />
  </Base>
);

export const IconReplay = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="m10.4 9.2 4.4 2.8-4.4 2.8z" />
  </Base>
);

export const IconPrescription = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.4 4.6h7.8l4 4V19a1.4 1.4 0 0 1-1.4 1.4H6.4A1.4 1.4 0 0 1 5 19V6a1.4 1.4 0 0 1 1.4-1.4Z" />
    <path d="M14 4.8v3.9h3.9" />
    <path d="M8.6 13.6h6M8.6 16.6h4" />
  </Base>
);

export const IconBook = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.4 5.4h5.2A2.4 2.4 0 0 1 12 7.8v11a2 2 0 0 0-2-1.6H4.4Z" />
    <path d="M19.6 5.4h-5.2A2.4 2.4 0 0 0 12 7.8v11a2 2 0 0 1 2-1.6h5.6Z" />
  </Base>
);

export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.8 5.6 6.2v5.4c0 4 2.7 6.8 6.4 8.6 3.7-1.8 6.4-4.6 6.4-8.6V6.2Z" />
    <path d="m9.4 12.2 2 2 3.2-3.6" />
  </Base>
);

export const IconFlask = (p: IconProps) => (
  <Base {...p}>
    <path d="M9.6 4.2h4.8" />
    <path d="M10.4 4.2v5L6.6 17a2 2 0 0 0 1.8 2.9h7.2a2 2 0 0 0 1.8-2.9l-3.8-7.8v-5" />
    <path d="M8.4 14.6h7.2" />
  </Base>
);

export const IconUser = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8.6" r="3" />
    <path d="M5.6 19.4c0-3 2.9-4.8 6.4-4.8s6.4 1.8 6.4 4.8" />
  </Base>
);

export const IconSpark = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.6l1.6 4.6 4.6 1.6-4.6 1.6L12 16l-1.6-4.6L5.8 9.8l4.6-1.6z" />
    <path d="M17.8 16.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" />
  </Base>
);
