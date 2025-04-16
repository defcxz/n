"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Edit, Save, X, BarChart3, FileDown, Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import EstadisticasAsignatura from "./estadisticas-asignatura"
import ObjetivosAsignatura from "./objetivos-asignatura"

// Tipos de datos
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

export default function GestorAsignaturas() {
  // Estado para almacenar las asignaturas
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [nuevaAsignatura, setNuevaAsignatura] = useState<Omit<Asignatura, "id" | "notas">>({
    nombre: "",
    profesor: "",
    creditos: 6,
    color: generarColorAleatorio(),
  })
  const [editandoAsignatura, setEditandoAsignatura] = useState<string | null>(null)
  const [nuevaNota, setNuevaNota] = useState<Omit<Nota, "id">>({
    nombre: "",
    valor: 0,
    ponderacion: 0,
  })
  const [asignaturaSeleccionadaParaNota, setAsignaturaSeleccionadaParaNota] = useState<string | null>(null)
  const [editandoNota, setEditandoNota] = useState<string | null>(null)
  const [dialogoEstadisticasAbierto, setDialogoEstadisticasAbierto] = useState(false)
  const [asignaturaEstadisticas, setAsignaturaEstadisticas] = useState<string | null>(null)
  const [dialogoObjetivosAbierto, setDialogoObjetivosAbierto] = useState(false)
  const [asignaturaObjetivos, setAsignaturaObjetivos] = useState<string | null>(null)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const asignaturasGuardadas = localStorage.getItem("asignaturas")
    if (asignaturasGuardadas) {
      setAsignaturas(JSON.parse(asignaturasGuardadas))
    }
  }, [])

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("asignaturas", JSON.stringify(asignaturas))
  }, [asignaturas])

  // Función para generar un color aleatorio
  function generarColorAleatorio() {
    const colores = [
      "#f87171", // rojo
      "#fb923c", // naranja
      "#facc15", // amarillo
      "#4ade80", // verde
      "#60a5fa", // azul
      "#a78bfa", // morado
      "#f472b6", // rosa
    ]
    return colores[Math.floor(Math.random() * colores.length)]
  }

  // Función para añadir una nueva asignatura
  function añadirAsignatura() {
    if (!nuevaAsignatura.nombre) return

    const nuevaAsignaturaCompleta: Asignatura = {
      id: Date.now().toString(),
      ...nuevaAsignatura,
      notas: [],
    }

    setAsignaturas([...asignaturas, nuevaAsignaturaCompleta])
    setNuevaAsignatura({
      nombre: "",
      profesor: "",
      creditos: 6,
      color: generarColorAleatorio(),
    })
    setActiveTab(nuevaAsignaturaCompleta.id)
  }

  // Función para editar una asignatura
  function guardarEdicionAsignatura(id: string) {
    setAsignaturas(
      asignaturas.map((asignatura) => {
        if (asignatura.id === id) {
          return {
            ...asignatura,
            nombre: nuevaAsignatura.nombre || asignatura.nombre,
            profesor: nuevaAsignatura.profesor || asignatura.profesor,
            creditos: nuevaAsignatura.creditos || asignatura.creditos,
            color: nuevaAsignatura.color || asignatura.color,
          }
        }
        return asignatura
      }),
    )
    setEditandoAsignatura(null)
    setNuevaAsignatura({
      nombre: "",
      profesor: "",
      creditos: 6,
      color: generarColorAleatorio(),
    })
  }

  // Función para eliminar una asignatura
  function eliminarAsignatura(id: string) {
    setAsignaturas(asignaturas.filter((asignatura) => asignatura.id !== id))
    setActiveTab("dashboard")
  }

  // Función para añadir una nueva nota
  function añadirNota() {
    if (!asignaturaSeleccionadaParaNota || !nuevaNota.nombre || nuevaNota.valor < 0 || nuevaNota.ponderacion <= 0)
      return

    const nuevaNotaCompleta: Nota = {
      id: Date.now().toString(),
      ...nuevaNota,
    }

    setAsignaturas(
      asignaturas.map((asignatura) => {
        if (asignatura.id === asignaturaSeleccionadaParaNota) {
          return {
            ...asignatura,
            notas: [...asignatura.notas, nuevaNotaCompleta],
          }
        }
        return asignatura
      }),
    )

    setNuevaNota({
      nombre: "",
      valor: 0,
      ponderacion: 0,
    })
    setAsignaturaSeleccionadaParaNota(null)
  }

  // Función para editar una nota
  function guardarEdicionNota(asignaturaId: string, notaId: string) {
    setAsignaturas(
      asignaturas.map((asignatura) => {
        if (asignatura.id === asignaturaId) {
          return {
            ...asignatura,
            notas: asignatura.notas.map((nota) => {
              if (nota.id === notaId) {
                return {
                  ...nota,
                  nombre: nuevaNota.nombre || nota.nombre,
                  valor: nuevaNota.valor !== undefined ? nuevaNota.valor : nota.valor,
                  ponderacion: nuevaNota.ponderacion !== undefined ? nuevaNota.ponderacion : nota.ponderacion,
                }
              }
              return nota
            }),
          }
        }
        return asignatura
      }),
    )
    setEditandoNota(null)
    setNuevaNota({
      nombre: "",
      valor: 0,
      ponderacion: 0,
    })
  }

  // Función para eliminar una nota
  function eliminarNota(asignaturaId: string, notaId: string) {
    setAsignaturas(
      asignaturas.map((asignatura) => {
        if (asignatura.id === asignaturaId) {
          return {
            ...asignatura,
            notas: asignatura.notas.filter((nota) => nota.id !== notaId),
          }
        }
        return asignatura
      }),
    )
  }

  // Función para calcular la nota media ponderada
  function calcularMediaPonderada(notas: Nota[]) {
    if (notas.length === 0) return 0

    const sumaPonderada = notas.reduce((acc, nota) => acc + nota.valor * nota.ponderacion, 0)
    const sumaPonderaciones = notas.reduce((acc, nota) => acc + nota.ponderacion, 0)

    return sumaPonderada / sumaPonderaciones
  }

  // Función para calcular el porcentaje evaluado
  function calcularPorcentajeEvaluado(notas: Nota[]) {
    if (notas.length === 0) return 0
    return notas.reduce((acc, nota) => acc + nota.ponderacion, 0)
  }

  // Función para exportar datos
  function exportarDatos() {
    const dataStr = JSON.stringify(asignaturas, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `mis_asignaturas_${new Date().toLocaleDateString()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Iniciar edición de asignatura
  function iniciarEdicionAsignatura(asignatura: Asignatura) {
    setEditandoAsignatura(asignatura.id)
    setNuevaAsignatura({
      nombre: asignatura.nombre,
      profesor: asignatura.profesor,
      creditos: asignatura.creditos,
      color: asignatura.color,
    })
  }

  // Iniciar edición de nota
  function iniciarEdicionNota(asignaturaId: string, nota: Nota) {
    setEditandoNota(nota.id)
    setNuevaNota({
      nombre: nota.nombre,
      valor: nota.valor,
      ponderacion: nota.ponderacion,
    })
  }

  // Abrir diálogo de estadísticas
  function abrirEstadisticas(asignaturaId: string) {
    setAsignaturaEstadisticas(asignaturaId)
    setDialogoEstadisticasAbierto(true)
  }

  // Abrir diálogo de objetivos
  function abrirObjetivos(asignaturaId: string) {
    setAsignaturaObjetivos(asignaturaId)
    setDialogoObjetivosAbierto(true)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-hidden max-w-[80%]">
            <TabsTrigger value="dashboard" className="px-4">
              Dashboard
            </TabsTrigger>
            {asignaturas.map((asignatura) => (
              <TabsTrigger key={asignatura.id} value={asignatura.id} className="px-4">
                {asignatura.nombre}
              </TabsTrigger>
            ))}
          </TabsList>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nueva Asignatura
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nueva Asignatura</DialogTitle>
                <DialogDescription>Introduce los detalles de la nueva asignatura.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={nuevaAsignatura.nombre}
                    onChange={(e) => setNuevaAsignatura({ ...nuevaAsignatura, nombre: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="profesor" className="text-right">
                    Profesor
                  </Label>
                  <Input
                    id="profesor"
                    value={nuevaAsignatura.profesor}
                    onChange={(e) => setNuevaAsignatura({ ...nuevaAsignatura, profesor: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="creditos" className="text-right">
                    Créditos
                  </Label>
                  <Input
                    id="creditos"
                    type="number"
                    min="1"
                    value={nuevaAsignatura.creditos}
                    onChange={(e) => setNuevaAsignatura({ ...nuevaAsignatura, creditos: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Color
                  </Label>
                  <div className="flex items-center col-span-3 gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={nuevaAsignatura.color}
                      onChange={(e) => setNuevaAsignatura({ ...nuevaAsignatura, color: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: nuevaAsignatura.color }} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={añadirAsignatura}>Añadir Asignatura</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asignaturas.map((asignatura) => {
              const mediaPonderada = calcularMediaPonderada(asignatura.notas)
              const porcentajeEvaluado = calcularPorcentajeEvaluado(asignatura.notas)

              return (
                <Card key={asignatura.id} className="overflow-hidden">
                  <div className="h-2" style={{ backgroundColor: asignatura.color }}></div>
                  <CardHeader>
                    <CardTitle>{asignatura.nombre}</CardTitle>
                    <CardDescription>
                      Profesor: {asignatura.profesor} • {asignatura.creditos} créditos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Nota media:</span>
                        <span className="text-sm font-bold">{mediaPonderada.toFixed(2)}</span>
                      </div>
                      <Progress value={mediaPonderada * 10} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Evaluado:</span>
                        <span className="text-sm font-bold">{porcentajeEvaluado}%</span>
                      </div>
                      <Progress value={porcentajeEvaluado} className="h-2" />
                    </div>
                    <div className="text-sm">
                      {asignatura.notas.length === 0 ? (
                        <p className="text-muted-foreground italic">No hay notas registradas</p>
                      ) : (
                        <div className="space-y-1">
                          {asignatura.notas.slice(0, 2).map((nota) => (
                            <div key={nota.id} className="flex justify-between">
                              <span>{nota.nombre}</span>
                              <span className="font-medium">{nota.valor.toFixed(2)}</span>
                            </div>
                          ))}
                          {asignatura.notas.length > 2 && (
                            <p className="text-muted-foreground text-xs text-right">
                              +{asignatura.notas.length - 2} más...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab(asignatura.id)}>
                      Ver Detalles
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => abrirEstadisticas(asignatura.id)}>
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => abrirObjetivos(asignatura.id)}>
                        <Target className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {asignaturas.length === 0 && (
            <Alert>
              <AlertDescription>
                No hay asignaturas registradas. Haz clic en "Nueva Asignatura" para comenzar.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={exportarDatos} disabled={asignaturas.length === 0}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </TabsContent>

        {asignaturas.map((asignatura) => {
          const mediaPonderada = calcularMediaPonderada(asignatura.notas)
          const porcentajeEvaluado = calcularPorcentajeEvaluado(asignatura.notas)

          return (
            <TabsContent key={asignatura.id} value={asignatura.id} className="space-y-6">
              <Card>
                <div className="h-2" style={{ backgroundColor: asignatura.color }}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  {editandoAsignatura === asignatura.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={nuevaAsignatura.nombre}
                        onChange={(e) => setNuevaAsignatura({ ...nuevaAsignatura, nombre: e.target.value })}
                        className="w-48"
                      />
                      <Button size="icon" variant="ghost" onClick={() => guardarEdicionAsignatura(asignatura.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditandoAsignatura(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CardTitle>{asignatura.nombre}</CardTitle>
                      <Button size="icon" variant="ghost" onClick={() => iniciarEdicionAsignatura(asignatura)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => eliminarAsignatura(asignatura.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Profesor</Label>
                          {editandoAsignatura === asignatura.id ? (
                            <Input
                              value={nuevaAsignatura.profesor}
                              onChange={(e) => setNuevaAsignatura({ ...nuevaAsignatura, profesor: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-sm mt-1">{asignatura.profesor}</p>
                          )}
                        </div>
                        <div>
                          <Label>Créditos</Label>
                          {editandoAsignatura === asignatura.id ? (
                            <Input
                              type="number"
                              min="1"
                              value={nuevaAsignatura.creditos}
                              onChange={(e) =>
                                setNuevaAsignatura({ ...nuevaAsignatura, creditos: Number(e.target.value) })
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-sm mt-1">{asignatura.creditos}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Nota media ponderada</Label>
                          <span className="font-bold">{mediaPonderada.toFixed(2)}</span>
                        </div>
                        <Progress value={mediaPonderada * 10} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Porcentaje evaluado</Label>
                          <span className="font-bold">{porcentajeEvaluado}%</span>
                        </div>
                        <Progress value={porcentajeEvaluado} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => abrirEstadisticas(asignatura.id)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Estadísticas
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => abrirObjetivos(asignatura.id)}>
                          <Target className="h-4 w-4 mr-2" />
                          Objetivos
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Notas</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAsignaturaSeleccionadaParaNota(asignatura.id)}
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Añadir Nota
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Añadir Nueva Nota</DialogTitle>
                              <DialogDescription>Introduce los detalles de la nueva nota.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nombreNota" className="text-right">
                                  Nombre
                                </Label>
                                <Input
                                  id="nombreNota"
                                  value={nuevaNota.nombre}
                                  onChange={(e) => setNuevaNota({ ...nuevaNota, nombre: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="valorNota" className="text-right">
                                  Valor (0-10)
                                </Label>
                                <Input
                                  id="valorNota"
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.01"
                                  value={nuevaNota.valor}
                                  onChange={(e) => setNuevaNota({ ...nuevaNota, valor: Number(e.target.value) })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ponderacionNota" className="text-right">
                                  Ponderación (%)
                                </Label>
                                <Input
                                  id="ponderacionNota"
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={nuevaNota.ponderacion}
                                  onChange={(e) => setNuevaNota({ ...nuevaNota, ponderacion: Number(e.target.value) })}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={añadirNota}>Añadir Nota</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {asignatura.notas.length === 0 ? (
                        <Alert>
                          <AlertDescription>No hay notas registradas para esta asignatura.</AlertDescription>
                        </Alert>
                      ) : (
                        <div className="space-y-2">
                          {asignatura.notas.map((nota) => (
                            <div key={nota.id} className="flex items-center justify-between p-3 border rounded-md">
                              {editandoNota === nota.id ? (
                                <div className="grid grid-cols-3 gap-2 w-full">
                                  <Input
                                    value={nuevaNota.nombre}
                                    onChange={(e) => setNuevaNota({ ...nuevaNota, nombre: e.target.value })}
                                    placeholder="Nombre"
                                  />
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.01"
                                    value={nuevaNota.valor}
                                    onChange={(e) => setNuevaNota({ ...nuevaNota, valor: Number(e.target.value) })}
                                    placeholder="Valor"
                                  />
                                  <Input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={nuevaNota.ponderacion}
                                    onChange={(e) =>
                                      setNuevaNota({ ...nuevaNota, ponderacion: Number(e.target.value) })
                                    }
                                    placeholder="Ponderación"
                                  />
                                  <div className="col-span-3 flex justify-end gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => guardarEdicionNota(asignatura.id, nota.id)}
                                    >
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditandoNota(null)}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="grid gap-1">
                                    <span className="font-medium">{nota.nombre}</span>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                      <span>Valor: {nota.valor.toFixed(2)}</span>
                                      <span>Ponderación: {nota.ponderacion}%</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => iniciarEdicionNota(asignatura.id, nota)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => eliminarNota(asignatura.id, nota.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Diálogo de estadísticas */}
      <Dialog open={dialogoEstadisticasAbierto} onOpenChange={setDialogoEstadisticasAbierto}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Estadísticas de la Asignatura</DialogTitle>
            <DialogDescription>Análisis detallado de tu rendimiento en esta asignatura.</DialogDescription>
          </DialogHeader>
          {asignaturaEstadisticas && (
            <EstadisticasAsignatura asignatura={asignaturas.find((a) => a.id === asignaturaEstadisticas)!} />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de objetivos */}
      <Dialog open={dialogoObjetivosAbierto} onOpenChange={setDialogoObjetivosAbierto}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Objetivos de la Asignatura</DialogTitle>
            <DialogDescription>Establece y gestiona tus objetivos para esta asignatura.</DialogDescription>
          </DialogHeader>
          {asignaturaObjetivos && (
            <ObjetivosAsignatura
              asignatura={asignaturas.find((a) => a.id === asignaturaObjetivos)!}
              onUpdate={(asignaturaActualizada) => {
                setAsignaturas(asignaturas.map((a) => (a.id === asignaturaActualizada.id ? asignaturaActualizada : a)))
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
