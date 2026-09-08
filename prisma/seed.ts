import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all(
    [
      ["Development", "Tools and resources for building software"],
      ["AI Tools", "Artificial intelligence products and assistants"],
      ["Work", "Productivity and collaboration tools"],
      ["Study", "Learning resources"],
      ["Entertainment", "Media and entertainment"],
    ].map(([name, description]) =>
      prisma.category.upsert({ where: { name }, update: { description }, create: { name, description } }),
    ),
  );

  const byName = new Map(categories.map((category) => [category.name, category.id]));
  const websites = [
    { name: "ChatGPT", url: "https://chatgpt.com", description: "AI assistant for everyday work", categoryId: byName.get("AI Tools"), faviconUrl: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128" },
    { name: "GitHub", url: "https://github.com", description: "Build and ship software together", categoryId: byName.get("Development"), faviconUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=128" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", description: "Developer questions and answers", categoryId: byName.get("Development"), faviconUrl: "https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=128" },
    { name: "Google Drive", url: "https://drive.google.com", description: "Store, share, and collaborate on files", categoryId: byName.get("Work"), faviconUrl: "https://www.google.com/s2/favicons?domain=drive.google.com&sz=128" },
  ];

  for (const website of websites) {
    const exists = await prisma.website.findFirst({ where: { url: website.url } });
    if (exists) await prisma.website.update({ where: { id: exists.id }, data: { faviconUrl: website.faviconUrl } });
    else await prisma.website.create({ data: website });
  }
}

main().finally(() => prisma.$disconnect());
