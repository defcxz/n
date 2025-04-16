import Link from "next/link";

export default function NotFound() {
    return (
        <main className="h-screen flex flex-col items-center justify-center p-12 md:p-24 gap-5">
            <h1 className="text-xl font-semibold">Hermanito mío, usted está medio perdido. 🥴</h1>
            <Link href="/login" className="underline hover:font-semibold">
            Volver al inicio
            </Link>
            <p className="mt-16 opacity-75 select-none">੯·̀͡⬮</p>
        </main>
    );
}