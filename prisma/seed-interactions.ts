/**
 * Dev utility: seeds a few orders and a chat between the demo ustads so the
 * orders and chats pages have content. Skips if any orders already exist.
 *
 * Usage: npx tsx --env-file=.env prisma/seed-interactions.ts
 */
import prisma from "./client";

async function main() {
  const me = await prisma.user.findUnique({
    where: { email: "demo.ustad1@ustad.dev" },
  });
  if (!me) throw new Error("Run seed-demo.ts first.");

  const existing = await prisma.order.count({
    where: { OR: [{ userId: me.id }, { gigUser: { userId: me.id } }] },
  });
  if (existing > 0) {
    console.log("Demo user already has orders — skipped.");
    return;
  }

  const othersGigs = await prisma.gig.findMany({
    where: { userId: { not: me.id } },
    take: 3,
    include: { user: true },
  });
  const myGig = await prisma.gig.findFirst({ where: { userId: me.id } });
  const otherUsers = await prisma.user.findMany({
    where: { id: { not: me.id }, email: { endsWith: "@ustad.dev" } },
    take: 2,
  });
  if (othersGigs.length < 3 || !myGig || otherUsers.length < 2)
    throw new Error("Not enough demo data — run seed-demo.ts first.");

  // Orders demo.ustad1 placed on other people's gigs.
  const placed = [
    { gig: othersGigs[0], status: "PENDING" as const, daysAgo: 0 },
    { gig: othersGigs[1], status: "ACCEPTED" as const, daysAgo: 2 },
    { gig: othersGigs[2], status: "COMPLETED" as const, daysAgo: 9 },
  ];
  for (const o of placed) {
    const startedAt = new Date(Date.now() - o.daysAgo * 86_400_000);
    await prisma.order.create({
      data: {
        userId: me.id,
        gigId: o.gig.id,
        rate: o.gig.rate,
        job_type: o.gig.job_type,
        status: o.status,
        startedAt,
        endAt: o.status === "COMPLETED" ? new Date() : null,
        requirements: `Salam! I need help with **${o.gig.title.toLowerCase()}** at my place in G-10.\n\n- Available after 5pm on weekdays\n- Materials can be discussed\n- Please bring your own tools`,
      },
    });
  }

  // Orders other people placed on demo.ustad1's gig.
  await prisma.order.create({
    data: {
      userId: otherUsers[0].id,
      gigId: myGig.id,
      rate: myGig.rate,
      job_type: myGig.job_type,
      status: "PENDING",
      requirements:
        "Need this done this weekend if possible. Two rooms, standard fittings — let me know if the rate works.",
    },
  });
  await prisma.order.create({
    data: {
      userId: otherUsers[1].id,
      gigId: myGig.id,
      rate: Math.round(myGig.rate * 0.8),
      job_type: myGig.job_type,
      status: "REJECTED",
      startedAt: new Date(Date.now() - 4 * 86_400_000),
      requirements: "Can you do it for a lower rate? Small job, one hour max.",
    },
  });

  // A chat with history spanning two days (shows the date separators).
  const partner = othersGigs[0].user;
  const chat = await prisma.chat.upsert({
    where: {
      receiverId_senderId: { receiverId: partner.id, senderId: me.id },
    },
    update: {},
    create: { senderId: me.id, receiverId: partner.id },
  });
  const yesterday = Date.now() - 86_400_000;
  const script: { from: string; text: string; at: number }[] = [
    { from: me.id, text: "Salam! I saw your gig — are you available this week?", at: yesterday },
    { from: partner.id, text: "Wa alaikum salam! Yes, I have slots on Thursday and Friday.", at: yesterday + 5 * 60_000 },
    { from: me.id, text: "Thursday after 5pm works. It's in G-10, two rooms.", at: yesterday + 9 * 60_000 },
    { from: partner.id, text: "Perfect. I'll bring my tools. Rate is as listed on the gig.", at: Date.now() - 2 * 60 * 60_000 },
    { from: me.id, text: "Great, I just placed the order 👍", at: Date.now() - 60 * 60_000 },
  ];
  for (const m of script) {
    await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: m.from,
        text: m.text,
        at: new Date(m.at),
      },
    });
  }

  console.log(
    `Seeded ${placed.length + 2} orders and a chat with ${script.length} messages.`
  );
}

main().finally(() => prisma.$disconnect());
