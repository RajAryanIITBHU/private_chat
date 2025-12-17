import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navbar */}
      <nav className=" absolute top-0 w-full py-3 flex justify-center items-center z-20">
        <Button variant={"link"}>
          <Link href={"/"}>Home</Link>
        </Button>
        <Button variant={"link"}>
          <Link href={"/rooms"}>Rooms</Link>
        </Button>
        <Button variant={"link"}>
          <Link href={"/about"}>About</Link>
        </Button>
      </nav>
      {children}
    </>
  );
}
