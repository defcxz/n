import type { Metadata } from "next"
import GestorAsignaturas from "@/components/gestor-asignaturas"

export const metadata: Metadata = {
  title: "Gestor de Asignaturas Universitarias",
  description: "Gestiona tus asignaturas, notas y ponderaciones de forma sencilla",
}

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Gestor de Asignaturas Universitarias
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          Gestiona tus asignaturas, notas y ponderaciones de forma sencilla
        </p>
      </div>
      <GestorAsignaturas />
    </main>
  )
}
