// src/pages/api/stations.ts

import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const stations = await prisma.chargingStation.findMany();
    res.status(200).json(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
