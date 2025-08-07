import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.chargingStation.createMany({
    data: [
      {
        name: "Lulu Mall EV Hub",
        location: "Kochi",
        latitude: 10.0253,
        longitude: 76.3089,
        pricePerUnit: 12.5,
        availableChargers: 3,
        totalChargers: 8,
        connectorTypes: JSON.stringify(["CCS2", "AC001", "CHAdeMO"]),
      },
      {
        name: "Technopark Charging Station",
        location: "Trivandrum",
        latitude: 8.5568,
        longitude: 76.8811,
        pricePerUnit: 10,
        availableChargers: 5,
        totalChargers: 10,
        connectorTypes: JSON.stringify(["CCS2", "Type2"]),
      },
      {
        name: "Infopark EV Zone",
        location: "Kakkanad",
        latitude: 10.0159,
        longitude: 76.3419,
        pricePerUnit: 11,
        availableChargers: 4,
        totalChargers: 6,
        connectorTypes: JSON.stringify(["AC001"]),
      },
    ],
  })
}

main()
  .then(() => {
    console.log("✅ Seeding complete")
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
