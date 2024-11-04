// src/app/api/chamados/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar todos os chamados do banco de dados
    const chamados = await prisma.chamado.findMany({
      where: {
        attributedAt:  null,
        finishedAt: null
    }});
    return NextResponse.json(chamados);
  } catch (error) {
    console.error('Erro ao buscar os chamados:', error);
    return NextResponse.json({ error: 'Erro ao buscar os chamados' }, { status: 500 });
  }
}