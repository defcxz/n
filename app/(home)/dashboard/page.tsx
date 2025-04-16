"use client";

import { useSearchParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Dashboard() {
    const [asignatura, setAsignatura] = useState("");
    const [nota, setNota] = useState<string>("");
    const [ponderacion, setPonderacion] = useState<string>("");
    const [notasTemp, setNotasTemp] = useState<number[]>([]);
    const [ponderacionesTemp, setPonderacionesTemp] = useState<number[]>([]);
    const [asignaturas, setAsignaturas] = useState([
        {
            nombre: "Matemáticas",
            notas: [5, 6, 7],
            ponderación: [0.3, 0.3, 0.4],
        },
        {
            nombre: "Lengua",
            notas: [4.5, 5.2, 2],
            ponderación: [0.2, 0.5, 0.3],
        },
    ]);
    const searchParams = useSearchParams();
    const username = searchParams.get("username");

    const handleAddNota = () => {
        if (nota === "") return;
        const notaNum = parseFloat(nota);
        if (isNaN(notaNum)) return;
        
        setNotasTemp([...notasTemp, notaNum]);
        setNota("");
    };

    const handleAddPonderacion = () => {
        if (ponderacion === "") return;
        const ponderacionNum = parseFloat(ponderacion);
        if (isNaN(ponderacionNum)) return;
        
        setPonderacionesTemp([...ponderacionesTemp, ponderacionNum]);
        setPonderacion("");
    };

    const handleAddAsignatura = (e: React.FormEvent) => {
        e.preventDefault();
        if (!asignatura || notasTemp.length === 0 || ponderacionesTemp.length === 0) return;
        
        // Verificar que las ponderaciones sumen 1
        const sumaPonderaciones = ponderacionesTemp.reduce((sum, p) => sum + p, 0);
        if (Math.abs(sumaPonderaciones - 1) > 0.01) {
            alert("Las ponderaciones deben sumar 1");
            return;
        }

        // Verificar que hay tantas notas como ponderaciones
        if (notasTemp.length !== ponderacionesTemp.length) {
            alert("Debe haber tantas notas como ponderaciones");
            return;
        }

        const newAsignatura = {
            nombre: asignatura,
            notas: notasTemp,
            ponderación: ponderacionesTemp,
        };
        
        setAsignaturas([...asignaturas, newAsignatura]);
        setAsignatura("");
        setNotasTemp([]);
        setPonderacionesTemp([]);
    };

    return (
        <main className="px-12 md:px-24">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Bienvenido, {username || "Usuario"}!</CardTitle>
                    <CardDescription>
                        Aquí puedes ver tu información.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Asignaturas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asignatura</TableHead>
                                <TableHead>Notas</TableHead>
                                <TableHead>Ponderación</TableHead>
                                <TableHead>Nota Final</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {asignaturas.map((asignatura, index) => (
                                <TableRow key={index}>
                                    <TableCell>{asignatura.nombre}</TableCell>
                                    <TableCell>{asignatura.notas.join(", ")}</TableCell>
                                    <TableCell>{asignatura.ponderación.join(", ")}</TableCell>
                                    <TableCell>
                                        {asignatura.notas
                                            .map((nota, i) => nota * asignatura.ponderación[i])
                                            .reduce((a, b) => a + b, 0)
                                            .toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption>
                            Aquí puedes ver tus asignaturas y sus notas.
                        </TableCaption>
                    </Table>
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleAddAsignatura} className="w-full flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="asignatura">Nombre de la asignatura</Label>
                                <Input
                                    id="asignatura"
                                    type="text"
                                    value={asignatura}
                                    onChange={(e) => setAsignatura(e.target.value)}
                                    placeholder="Nombre de la asignatura"
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <Label>Notas actuales: {notasTemp.join(", ")}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={nota}
                                        onChange={(e) => setNota(e.target.value)}
                                        placeholder="Añadir nota (0-10)"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                    />
                                    <Button type="button" variant="outline" onClick={handleAddNota}>
                                        Añadir Nota
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <Label>Ponderaciones actuales: {ponderacionesTemp.join(", ")}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={ponderacion}
                                        onChange={(e) => setPonderacion(e.target.value)}
                                        placeholder="Añadir ponderación (0-1)"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                    <Button type="button" variant="outline" onClick={handleAddPonderacion}>
                                        Añadir Ponderación
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        <Button type="submit" className="mt-5">
                            Añadir Asignatura
                        </Button>
                    </form>

                </CardFooter>
            </Card>

        </main>
    );
}