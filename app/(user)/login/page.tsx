"use client";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/dashboard?username=${formData.username}&password=${formData.password}`);
    };

    return (
        <main className="flex flex-col items-center justify-between p-12 md:p-24 gap-5">
            <h1 className="text-2xl font-semibold">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto w-full md:w-96">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Nombre de Usuario"
                    value={formData.username}
                    onChange={handleChange}
                />
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                />
                <Button className="mt-5" type="submit" variant={"outline"}>
                    Iniciar sesión
                </Button>
            </form>
        </main>
    );
}