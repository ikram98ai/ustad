/**
 * Dev utility: gives every gig without coordinates a random location
 * within RADIUS_KM of CENTER so the explore map has pins to show.
 *
 * Usage: npx tsx --env-file=.env prisma/backfill-locations.ts [lat] [lng]
 */
import prisma from "./client";

const CENTER = {
  lat: parseFloat(process.argv[2] ?? "33.6844"), // Islamabad
  lng: parseFloat(process.argv[3] ?? "73.0479"),
};
const RADIUS_KM = 12;

async function main() {
  const gigs = await prisma.gig.findMany({
    where: { latitude: null },
    select: { id: true },
  });

  for (const gig of gigs) {
    const r = RADIUS_KM * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const latitude = CENTER.lat + (r / 110.574) * Math.cos(theta);
    const longitude =
      CENTER.lng +
      (r / (111.32 * Math.cos((CENTER.lat * Math.PI) / 180))) *
        Math.sin(theta);
    await prisma.gig.update({
      where: { id: gig.id },
      data: { latitude, longitude },
    });
  }

  console.log(
    `Backfilled ${gigs.length} gig(s) around ${CENTER.lat}, ${CENTER.lng}`
  );
}

main().finally(() => prisma.$disconnect());
