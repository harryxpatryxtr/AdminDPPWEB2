import { NextResponse, NextRequest } from 'next/server';
import { createRole, getAllRoles,updateRole  } from '../../../services/roleService';

export async function GET() {
  try {
    console.log("GET /api/roles called");
    const roles = await getAllRoles();
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener roles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = await createRole(body);
    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear rol' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    const updatedRole = await updateRole(id, updateData);
    if (!updatedRole) {
      return NextResponse.json(
        { error: 'Rol no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedRole);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar rol' },
      { status: 500 }
    );
  }
}
