// src/app/api/stations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/generated/prisma';

export async function GET() {
  const stations = await prisma.station.findMany();
  return NextResponse.json(stations);
}
