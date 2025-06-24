import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center gap-6 py-4 border-b mb-6">
      <Link href="/">Home</Link>
      <Link href="/upload">Upload</Link>
      <Link href="/gallery">Gallery</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </nav>
  );
} 