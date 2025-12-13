import logoSvg from '@/assets/icons/epiphany-logo.svg';

/**
 * EpiphanyLogo - The brand logo displayed above the search bar.
 *
 * Design Specs (from Figma node 9:312):
 * - Size: 102×102px
 * - Centered above search bar
 * - SVG asset: assets/icons/epiphany-logo.svg
 */
export function EpiphanyLogo() {
  return (
    <div className="flex flex-col items-center">
      <img
        src={logoSvg}
        alt="Epiphany"
        width={102}
        height={102}
        className="select-none"
      />
    </div>
  );
}

export default EpiphanyLogo;
