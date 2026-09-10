import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all(
    [
      ["Development", "Tools and resources for building software"],
      ["AI Tools", "Artificial intelligence products and assistants"],
      ["Work", "Productivity and collaboration tools"],
      ["Study", "Learning resources"],
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
    { name: "Victionary English", url: "https://victionaryenglish.com", description: "Vocabulary learning and smart review for students", categoryId: byName.get("Study"), faviconUrl: "https://www.google.com/s2/favicons?domain=victionaryenglish.com&sz=128" },
  ];

  for (const website of websites) {
    const exists = await prisma.website.findFirst({ where: { url: website.url } });
    if (exists) await prisma.website.update({ where: { id: exists.id }, data: website });
    else await prisma.website.create({ data: website });
  }

  await prisma.category.deleteMany({
    where: { name: "Entertainment", websites: { none: {} } },
  });
}

main().finally(() => prisma.$disconnect());
