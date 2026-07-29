/**
 * Dev utility: seeds professions, demo ustads and located gigs around
 * Islamabad so the explore map has content. Safe to re-run — professions
 * are upserted and gigs are only created when the table is empty.
 *
 * Usage: npx tsx --env-file=.env prisma/seed-demo.ts
 */
import { JobType } from "./generated/enums";
import prisma from "./client";

const PROFESSIONS = [
  "Electrician",
  "Plumber",
  "Mechanic",
  "Carpenter",
  "Painter",
  "AC Technician",
  "Chef",
  "Tutor",
];

const USTADS = [
  "Rashid Mehmood",
  "Akbar Ali",
  "Salma Bibi",
  "Junaid Khan",
  "Tariq Aziz",
  "Nadia Hussain",
];

const GIGS: {
  title: string;
  profession: string;
  rate: number;
  job_type: JobType;
  range: number;
  lat: number;
  lng: number;
  address: string;
  description: string;
}[] = [
  { title: "House wiring & breaker repair", profession: "Electrician", rate: 15, job_type: "HOURLY", range: 10, lat: 33.7196, lng: 73.057, address: "F-7 Markaz, Islamabad", description: "Certified electrician with **12 years** of experience.\n\n- Complete house wiring\n- Breaker & panel repair\n- Emergency callouts" },
  { title: "UPS & solar inverter installation", profession: "Electrician", rate: 80, job_type: "FIX", range: 20, lat: 33.6900, lng: 73.0350, address: "G-9 Markaz, Islamabad", description: "Solar & UPS specialist. Neat installs, one-year workmanship guarantee." },
  { title: "Leak fixing & bathroom fitting", profession: "Plumber", rate: 12, job_type: "HOURLY", range: 8, lat: 33.6680, lng: 73.0740, address: "I-8/4, Islamabad", description: "Fast, clean plumbing work.\n\n- Leak detection\n- Mixer & sanitary fitting\n- Water tank cleaning" },
  { title: "Complete kitchen plumbing", profession: "Plumber", rate: 150, job_type: "FIX", range: 15, lat: 33.7100, lng: 73.0550, address: "Blue Area, Islamabad", description: "End-to-end kitchen plumbing with quality fittings." },
  { title: "Car tuning & engine diagnostics", profession: "Mechanic", rate: 40, job_type: "FIX", range: 12, lat: 33.5980, lng: 73.0480, address: "Saddar, Rawalpindi", description: "Computerized diagnostics, tuning, and general repair. Home service available." },
  { title: "Doorstep car service", profession: "Mechanic", rate: 25, job_type: "HOURLY", range: 18, lat: 33.6520, lng: 72.9640, address: "G-13, Islamabad", description: "Oil change, brakes and battery service at your doorstep." },
  { title: "Custom wardrobes & kitchen cabinets", profession: "Carpenter", rate: 30, job_type: "DAILY", range: 25, lat: 33.7000, lng: 72.9800, address: "E-11, Islamabad", description: "Custom woodwork with lamination and soft-close fittings." },
  { title: "Furniture repair & polish", profession: "Carpenter", rate: 18, job_type: "HOURLY", range: 10, lat: 33.6280, lng: 73.0710, address: "Gulberg Greens, Islamabad", description: "Sofa, bed and table repair with spray polish finishing." },
  { title: "Interior wall painting", profession: "Painter", rate: 35, job_type: "DAILY", range: 20, lat: 33.6844, lng: 73.0479, address: "Centaurus area, Islamabad", description: "Weather-shield and matt finishes, clean taped edges." },
  { title: "AC installation & gas refill", profession: "AC Technician", rate: 45, job_type: "FIX", range: 15, lat: 33.6620, lng: 73.0080, address: "G-11, Islamabad", description: "Split AC install, service and gas top-up with pressure test." },
  { title: "Home chef for events", profession: "Chef", rate: 120, job_type: "DAILY", range: 30, lat: 33.7290, lng: 73.0930, address: "F-6, Islamabad", description: "Desi & continental menus for gatherings up to 60 guests." },
  { title: "O/A-Level maths tuition", profession: "Tutor", rate: 200, job_type: "MONTHLY", range: 12, lat: 33.7080, lng: 73.0500, address: "F-8, Islamabad", description: "Cambridge-experienced tutor, home visits, past-paper focused." },
];

async function main() {
  const professions = new Map<string, string>();
  for (const title of PROFESSIONS) {
    const p = await prisma.profession.upsert({
      where: { title },
      update: {},
      create: { title },
    });
    professions.set(title, p.id);
  }

  if ((await prisma.gig.count()) > 0) {
    console.log("Gigs already exist — skipped gig seeding.");
    return;
  }

  const users = [];
  for (const [i, name] of USTADS.entries()) {
    users.push(
      await prisma.user.upsert({
        where: { email: `demo.ustad${i + 1}@ustad.dev` },
        update: {},
        create: { name, email: `demo.ustad${i + 1}@ustad.dev` },
      })
    );
  }

  for (const [i, gig] of GIGS.entries()) {
    await prisma.gig.create({
      data: {
        title: gig.title,
        description: gig.description,
        rate: gig.rate,
        range: gig.range,
        job_type: gig.job_type,
        latitude: gig.lat,
        longitude: gig.lng,
        address: gig.address,
        professionId: professions.get(gig.profession)!,
        userId: users[i % users.length].id,
      },
    });
  }

  console.log(
    `Seeded ${PROFESSIONS.length} professions, ${USTADS.length} demo ustads, ${GIGS.length} gigs.`
  );
}

main().finally(() => prisma.$disconnect());
