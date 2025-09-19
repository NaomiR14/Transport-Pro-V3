// src/app/api/talleres/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Taller, CreateTallerRequest } from '@/types/taller'

// Simulated talleres data (should be replaced with DB or persistent storage)
const talleres: Taller[] = []

// GET /api/talleres - Obtener todos los talleres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('q')
    const especialidad = searchParams.get('especialidad')

    let filteredTalleres = talleres

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredTalleres = filteredTalleres.filter(taller =>
        taller.name.toLowerCase().includes(term) ||
        taller.id.toLowerCase().includes(term) ||
        taller.contactPerson.toLowerCase().includes(term) ||
        taller.email.toLowerCase().includes(term) ||
        taller.phoneNumber.includes(term) ||
        taller.especialidades?.some(esp => esp.toLowerCase().includes(term))
      )
    }

    // Filtro por especialidad
    if (especialidad) {
      filteredTalleres = filteredTalleres.filter(taller =>
        taller.especialidades?.includes(especialidad)
      )
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json(filteredTalleres)
  } catch (error) {
    console.error('Error fetching talleres:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/talleres - Crear nuevo taller
export async function POST(request: NextRequest) {
  try {
    const data: CreateTallerRequest = await request.json()

    // Validación básica
    if (!data.name || !data.numero_taller) {
      return NextResponse.json(
        { message: 'Nombre y número de taller son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el número de taller ya existe
    const existingTaller = talleres.find(t => t.numero_taller === data.numero_taller)
    if (existingTaller) {
      return NextResponse.json(
        { message: 'El número de taller ya existe' },
        { status: 409 }
      )
    }

    // Crear el nuevo taller
    const newTaller: Taller = {
      id: crypto.randomUUID(),
      name: data.name,
      numero_taller: data.numero_taller,
      contactPerson: data.contactPerson || '',
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      especialidades: data.especialidades || [],
      address: data.address || '', // Add address property
    }
    talleres.push(newTaller)

    return NextResponse.json(newTaller, { status: 201 })
  } catch (error) {
    console.error('Error creating taller:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}