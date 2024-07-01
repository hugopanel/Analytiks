import Header from "@/components/header";
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <button><Link href="./catalogue">Catalogue</Link></button>     
      </main>
    </>
  );
}
