import { PrismaClient } from "@prisma/client"; // This connects to DB
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface Props {
  params: {
    id: string;
  };
}

export default async function StationPage({ params }: Props) {
  const station = await prisma.chargingStation.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!station) {
    return notFound();
  }

  //const connectorList = JSON.parse(station.connectorTypes || "[]");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{station.name}</h1>
      <p>📍 Location: {station.location}</p>
      <p>🔌 Chargers: {station.availableChargers} / {station.totalChargers}</p>
      <p>⚡ Price: ₹{station.pricePerUnit} per unit</p>
      <p>🔗 Connectors: {JSON.parse(station.connectorTypes).join(", ")}</p>
      {/* Later: Add map preview, booking button, and more */}
    </div>
  );
}
