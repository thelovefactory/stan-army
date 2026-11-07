import type { SVGProps } from "react";

// Original Stan Army UI drawings. Familiar silhouettes with a small star detail.
// The labelled control supplies the accessible name; its icon is decorative.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };
function Frame({ size = 22, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}
export function StanPhotoIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9" />
      <path d="m3 17 5-6 4 5 3-3 6 6" />
      <circle cx="8" cy="7" r="1" />
      <path d="M19 1v6m-3-3h6m-5-2 4 4m0-4-4 4" />
    </Frame>
  );
}
export function StanGifIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
      <path d="M9 9H6v6h3v-3H8m4-3v6m3 0V9h3m-3 3h2" />
    </Frame>
  );
}

export function StanPollIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="M4 3v18h17M8 16v-5h3v5m3 0V6h3v10m3 0v-3" />
    </Frame>
  );
}

export function StanEmojiIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 9h.01M16 9h.01M8 14c2 3 6 3 8 0" />
    </Frame>
  );
}

export function StanStarIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" />
    </Frame>
  );
}
export function StanCommunityIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
    </Frame>
  );
}
