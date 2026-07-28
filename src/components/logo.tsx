import Link from "next/link";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link className={`logo ${dark ? "logo-dark" : ""}`} href="/" aria-label="GalleryOS home">
      <span className="logo-mark"><i /><i /><i /></span>
      <span>GalleryOS</span>
    </Link>
  );
}
