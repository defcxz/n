"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Nota {
  id: string
  nombre: string
  valor: number
  ponderacion: number
}

interface Asignatura {
  id: string
  nombre: string
  profesor: string
  creditos: number
  notas: Nota[]
  color: string
}

interface EstadisticasAsignaturaProps {
  asignatura: Asignatura
}

export default function EstadisticasAsignatura({ asignatura }: EstadisticasAsignaturaProps) {
  const [activeTab, setActiveTab] = useState("resumen")

  // Calcular estadísticas
  const calcularMediaPonderada = () => {
    if (asignatura.notas.length === 0) return 0

    const sumaPonderada = asignatura.notas.reduce((acc, nota) => acc + nota.valor * nota.ponderacion, 0)
    const sumaPonderaciones = asignatura.notas.reduce((acc, nota) => acc + nota.ponderacion, 0)

    return sumaPonderada / sumaPonderaciones
  }

  const calcularPorcentajeEvaluado = () => {
    if (asignatura.notas.length === 0) return 0
    return asignatura.notas.reduce((acc, nota) => acc + nota.ponderacion, 0)
  }

  const calcularNotaMaxima = () => {
    if (asignatura.notas.length === 0) return 0
    return Math.max(...asignatura.notas.map((nota) => nota.valor))
  }

  const calcularNotaMinima = () => {
    if (asignatura.notas.length === 0) return 0
    return Math.min(...asignatura.notas.map((nota) => nota.valor))
  }

  const calcularDistribucionNotas = () => {
    const distribucion = [0, 0, 0, 0, 0] // [0-2, 2-4, 4-6, 6-8, 8-10]

    asignatura.notas.forEach((nota) => {
      if (nota.valor >= 0 && nota.valor < 2) distribucion[0]++
      else if (nota.valor >= 2 && nota.valor < 4) distribucion[1]++
      else if (nota.valor >= 4 && nota.valor < 6) distribucion[2]++
      else if (nota.valor >= 6 && nota.valor < 8) distribucion[3]++
      else if (nota.valor >= 8 && nota.valor <= 10) distribucion[4]++
    })

    return distribucion
  }

  const mediaPonderada = calcularMediaPonderada()
  const porcentajeEvaluado = calcularPorcentajeEvaluado()
  const notaMaxima = calcularNotaMaxima()
  const notaMinima = calcularNotaMinima()
  const distribucionNotas = calcularDistribucionNotas()
  const totalNotas = asignatura.notas.length

  // Determinar estado de la asignatura
  const determinarEstado = () => {
    if (asignatura.notas.length === 0) return "Sin datos"
    if (mediaPonderada >= 9) return "Excelente"
    if (mediaPonderada >= 7) return "Muy bien"
    if (mediaPonderada >= 5) return "Aprobado"
    return "Necesita mejorar"
  }

  const estado = determinarEstado()
  const colorEstado = () => {
    if (estado === "Sin datos") return "text-gray-500"
    if (estado === "Excelente") return "text-green-500"
    if (estado === "Muy bien") return "text-blue-500"
    if (estado === "Aprobado") return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="distribucion">Distribución</TabsTrigger>
          <TabsTrigger value="tendencia">Tendencia</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Estado General</CardTitle>
                <CardDescription>Resumen de tu rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-32">
                  <div className={`text-3xl font-bold ${colorEstado()}`}>{estado}</div>
                  <div className="text-xl font-semibold mt-2">{mediaPonderada.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Nota media ponderada</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progreso</CardTitle>
                <CardDescription>Porcentaje evaluado de la asignatura</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="text-3xl font-bold">{porcentajeEvaluado}%</div>
                  <div className="w-full mt-4">
                    <Progress value={porcentajeEvaluado} className="h-4" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {porcentajeEvaluado < 100 ? `Falta evaluar: ${100 - porcentajeEvaluado}%` : "Evaluación completa"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Evaluaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-24">
                  <div className="text-3xl font-bold">{totalNotas}</div>
                  <div className="text-sm text-muted-foreground mt-1">Notas registradas</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Nota Máxima</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-24">
                  <div className="text-3xl font-bold">{notaMaxima.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Mejor calificación</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Nota Mínima</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-24">
                  <div className="text-3xl font-bold">{notaMinima.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Calificación más baja</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribucion">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Notas</CardTitle>
              <CardDescription>Análisis de la distribución de tus calificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>0-2</span>
                    <span>{distribucionNotas[0]} notas</span>
                  </div>
                  <Progress
                    value={totalNotas > 0 ? (distribucionNotas[0] / totalNotas) * 100 : 0}
                    className="h-4 bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>2-4</span>
                    <span>{distribucionNotas[1]} notas</span>
                  </div>
                  <Progress
                    value={totalNotas > 0 ? (distribucionNotas[1] / totalNotas) * 100 : 0}
                    className="h-4 bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>4-6</span>
                    <span>{distribucionNotas[2]} notas</span>
                  </div>
                  <Progress
                    value={totalNotas > 0 ? (distribucionNotas[2] / totalNotas) * 100 : 0}
                    className="h-4 bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>6-8</span>
                    <span>{distribucionNotas[3]} notas</span>
                  </div>
                  <Progress
                    value={totalNotas > 0 ? (distribucionNotas[3] / totalNotas) * 100 : 0}
                    className="h-4 bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>8-10</span>
                    <span>{distribucionNotas[4]} notas</span>
                  </div>
                  <Progress
                    value={totalNotas > 0 ? (distribucionNotas[4] / totalNotas) * 100 : 0}
                    className="h-4 bg-gray-100"
                  />
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {totalNotas === 0
                  ? "No hay suficientes datos para mostrar la distribución"
                  : `Basado en ${totalNotas} evaluaciones registradas`}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendencia">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Notas</CardTitle>
              <CardDescription>Evolución de tus calificaciones a lo largo del tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              {asignatura.notas.length < 2 ? (
                <div className="flex items-center justify-center h-40 text-center">
                  <p className="text-muted-foreground">
                    Se necesitan al menos 2 notas para mostrar la tendencia.
                    <br />
                    Añade más evaluaciones para ver este análisis.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-60 flex items-end justify-between gap-2">
                    {asignatura.notas.map((nota, index) => (
                      <div key={nota.id} className="flex flex-col items-center">
                        <div
                          className="w-10 rounded-t-md"
                          style={{
                            height: `${nota.valor * 5}px`,
                            backgroundColor: asignatura.color,
                          }}
                        />
                        <div className="text-xs mt-1 w-12 text-center truncate" title={nota.nombre}>
                          {nota.nombre}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Primera evaluación</span>
                    <span>Última evaluación</span>
                  </div>

                  <div className="text-center text-sm mt-4">
                    {mediaPonderada > notaMinima ? (
                      <p className="text-green-600">
                        Tu rendimiento ha mejorado desde la nota más baja ({notaMinima.toFixed(2)})
                      </p>
                    ) : (
                      <p className="text-yellow-600">
                        Tu rendimiento ha disminuido desde la nota más alta ({notaMaxima.toFixed(2)})
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
