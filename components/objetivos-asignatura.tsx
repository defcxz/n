"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Trash2, PlusCircle, Target, Trophy } from "lucide-react"

interface Nota {
  id: string
  nombre: string
  valor: number
  ponderacion: number
}

interface Objetivo {
  id: string
  descripcion: string
  notaObjetivo: number
  completado: boolean
}

interface Asignatura {
  id: string
  nombre: string
  profesor: string
  notas: Nota[]
  color: string
  objetivos?: Objetivo[]
}

interface ObjetivosAsignaturaProps {
  asignatura: Asignatura
  onUpdate: (asignaturaActualizada: Asignatura) => void
}

export default function ObjetivosAsignatura({ asignatura, onUpdate }: ObjetivosAsignaturaProps) {
  // Inicializar objetivos si no existen
  useEffect(() => {
    if (!asignatura.objetivos) {
      const asignaturaActualizada = {
        ...asignatura,
        objetivos: [],
      }
      onUpdate(asignaturaActualizada)
    }
  }, [asignatura, onUpdate])

  const [nuevoObjetivo, setNuevoObjetivo] = useState({
    descripcion: "",
    notaObjetivo: 5,
  })

  // Calcular la nota media ponderada actual
  const calcularMediaPonderada = () => {
    if (asignatura.notas.length === 0) return 0

    const sumaPonderada = asignatura.notas.reduce((acc, nota) => acc + nota.valor * nota.ponderacion, 0)
    const sumaPonderaciones = asignatura.notas.reduce((acc, nota) => acc + nota.ponderacion, 0)

    return sumaPonderada / sumaPonderaciones
  }

  const mediaPonderada = calcularMediaPonderada()

  // Añadir un nuevo objetivo
  const anadirObjetivo = () => {
    if (!nuevoObjetivo.descripcion) return

    const objetivoNuevo: Objetivo = {
      id: Date.now().toString(),
      descripcion: nuevoObjetivo.descripcion,
      notaObjetivo: nuevoObjetivo.notaObjetivo,
      completado: mediaPonderada >= nuevoObjetivo.notaObjetivo,
    }

    const asignaturaActualizada = {
      ...asignatura,
      objetivos: [...(asignatura.objetivos || []), objetivoNuevo],
    }

    onUpdate(asignaturaActualizada)
    setNuevoObjetivo({
      descripcion: "",
      notaObjetivo: 5,
    })
  }

  // Eliminar un objetivo
  const eliminarObjetivo = (id: string) => {
    const asignaturaActualizada = {
      ...asignatura,
      objetivos: (asignatura.objetivos || []).filter((objetivo) => objetivo.id !== id),
    }
    onUpdate(asignaturaActualizada)
  }

  // Marcar objetivo como completado
  const marcarComoCompletado = (id: string, completado: boolean) => {
    const asignaturaActualizada = {
      ...asignatura,
      objetivos: (asignatura.objetivos || []).map((objetivo) =>
        objetivo.id === id ? { ...objetivo, completado } : objetivo,
      ),
    }
    onUpdate(asignaturaActualizada)
  }

  // Calcular nota necesaria para alcanzar un objetivo
  const calcularNotaNecesaria = (notaObjetivo: number) => {
    if (asignatura.notas.length === 0) return notaObjetivo

    const sumaPonderada = asignatura.notas.reduce((acc, nota) => acc + nota.valor * nota.ponderacion, 0)
    const sumaPonderaciones = asignatura.notas.reduce((acc, nota) => acc + nota.ponderacion, 0)

    // Si ya se ha evaluado todo, no se puede calcular
    if (sumaPonderaciones >= 100) return null

    // Calcular la nota necesaria en el porcentaje restante
    const porcentajeRestante = 100 - sumaPonderaciones
    const notaNecesaria = (notaObjetivo * 100 - sumaPonderada) / porcentajeRestante

    return notaNecesaria > 10 ? null : Math.max(0, notaNecesaria)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Situación Actual</CardTitle>
            <CardDescription>Tu nota media actual y progreso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-4xl font-bold">{mediaPonderada.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground mt-1">Nota media ponderada</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Progreso hacia nota máxima (10)</span>
                <span className="text-sm font-medium">{(mediaPonderada * 10).toFixed(0)}%</span>
              </div>
              <Progress value={mediaPonderada * 10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Añadir Nuevo Objetivo</CardTitle>
            <CardDescription>Define una meta para esta asignatura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  placeholder="Ej: Aprobar el examen final"
                  value={nuevoObjetivo.descripcion}
                  onChange={(e) => setNuevoObjetivo({ ...nuevoObjetivo, descripcion: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notaObjetivo">Nota objetivo (0-10)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="notaObjetivo"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={nuevoObjetivo.notaObjetivo}
                    onChange={(e) => setNuevoObjetivo({ ...nuevoObjetivo, notaObjetivo: Number(e.target.value) })}
                  />
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: asignatura.color }}
                  >
                    {nuevoObjetivo.notaObjetivo}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={anadirObjetivo} disabled={!nuevoObjetivo.descripcion}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Añadir Objetivo
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Mis Objetivos
        </h3>

        {!asignatura.objetivos || asignatura.objetivos.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32 text-center">
              <p className="text-muted-foreground">
                No has definido ningún objetivo para esta asignatura.
                <br />
                Añade tu primer objetivo usando el formulario de arriba.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {asignatura.objetivos.map((objetivo) => {
              const notaNecesaria = calcularNotaNecesaria(objetivo.notaObjetivo)

              return (
                <Card key={objetivo.id} className={objetivo.completado ? "border-green-200 bg-green-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          {objetivo.completado && <Trophy className="h-4 w-4 text-green-500 mr-2" />}
                          <h4 className="font-medium">{objetivo.descripcion}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Nota objetivo: {objetivo.notaObjetivo.toFixed(1)}
                        </p>

                        {!objetivo.completado && (
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progreso</span>
                              <span>
                                {mediaPonderada.toFixed(1)} / {objetivo.notaObjetivo.toFixed(1)}
                              </span>
                            </div>
                            <Progress value={(mediaPonderada / objetivo.notaObjetivo) * 100} className="h-2" />

                            {notaNecesaria !== null ? (
                              <p className="text-xs mt-2">
                                Necesitas sacar al menos <strong>{notaNecesaria.toFixed(2)}</strong> en el{" "}
                                {(100 - calcularPorcentajeEvaluado()).toFixed(0)}% restante de la asignatura.
                              </p>
                            ) : (
                              <p className="text-xs mt-2 text-yellow-600">
                                {calcularPorcentajeEvaluado() >= 100
                                  ? "Ya no puedes alcanzar este objetivo (evaluación completa)."
                                  : "Este objetivo es inalcanzable con las notas actuales."}
                              </p>
                            )}
                          </div>
                        )}

                        {objetivo.completado && (
                          <p className="text-xs text-green-600 mt-2">
                            ¡Objetivo completado! Has alcanzado la nota deseada.
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!objetivo.completado && mediaPonderada >= objetivo.notaObjetivo && (
                          <Button variant="outline" size="sm" onClick={() => marcarComoCompletado(objetivo.id, true)}>
                            <Trophy className="h-4 w-4 mr-1" />
                            Completar
                          </Button>
                        )}

                        {objetivo.completado && (
                          <Button variant="outline" size="sm" onClick={() => marcarComoCompletado(objetivo.id, false)}>
                            Desmarcar
                          </Button>
                        )}

                        <Button variant="ghost" size="icon" onClick={() => eliminarObjetivo(objetivo.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  // Función auxiliar para calcular el porcentaje evaluado
  function calcularPorcentajeEvaluado() {
    if (asignatura.notas.length === 0) return 0
    return asignatura.notas.reduce((acc, nota) => acc + nota.ponderacion, 0)
  }
}
