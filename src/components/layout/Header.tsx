import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">PurpleOne</Link>

      <nav className="flex gap-6">
        <Link href="/collections/dresses" className="hover:underline">Dresses</Link>
        <Link href="/collections/earrings" className="hover:underline">Earrings</Link>
        {/* Add more categories here */}
        <Link href="/cart" className="hover:underline">Cart</Link>
      </nav>
    </header>
  )
}
