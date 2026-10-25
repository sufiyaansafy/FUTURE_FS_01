// The logo: three offset bars (forest, crimson, charcoal), a miniature of the
// front end / back end / database stack shown in the hero.
export default function StackMark({ size = 28 }) {
  return (
    <svg
      className="stack-mark"
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="4" width="20" height="5" fill="var(--forest)" />
      <rect x="4" y="11.5" width="20" height="5" fill="var(--crimson)" />
      <rect x="6" y="19" width="20" height="5" fill="var(--charcoal)" />
    </svg>
  )
}
