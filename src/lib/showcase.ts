import { getDomain } from "@/lib/url";

/** Editorial selection: add verified student projects here. Names and links
 * stay in the database; external tools remain available in /systems. */
export const showcaseCatalog = [
  { hostname: "victionaryenglish.com", slug: "victionary", category: "Học tập & Ngôn ngữ", summary: "Mở rộng vốn từ tiếng Anh với từ điển học thuật, trợ lý AI và ôn tập thông minh.", color: "lavender", loginRequired: false },
  { hostname: "myinterview.hzi.io.vn", slug: "my-interview", category: "AI & Nghề nghiệp", summary: "Luyện phỏng vấn theo CV và công việc mục tiêu, nhận phản hồi để tự tin hơn từng câu trả lời.", color: "mint", loginRequired: false },
  { hostname: "v-shield.site", slug: "v-shield", category: "Công nghệ & An ninh", summary: "Khám phá giải pháp kiểm soát an ninh tích hợp nhận diện khuôn mặt, mã QR và giám sát thông minh.", color: "sand", loginRequired: false },
  { hostname: "admin.anhemmotor.online", slug: "anh-em-motor", category: "Quản trị & Kinh doanh", summary: "Không gian quản trị dành cho Anh Em Motor, kết nối công nghệ với hoạt động kinh doanh xe máy.", color: "peach", loginRequired: true },
  { hostname: "shbagents.site", slug: "shb-agents", category: "Quản trị & Vận tải", summary: "Cổng quản trị hệ thống vận tải SHB Agents, tập trung các nghiệp vụ vận hành trong một không gian làm việc.", color: "blue", loginRequired: true },
] as const;

type WebsiteSource = { id: string; name: string; url: string };

export function selectShowcaseProducts(websites: WebsiteSource[]) {
  return showcaseCatalog.flatMap((entry) => {
    const website = websites.find((item) => getDomain(item.url) === entry.hostname);
    return website ? [{ ...entry, id: website.id, name: website.name === "Anh Em Motor Admin" ? "Anh Em Motor" : website.name, url: website.url, image: `/showcase/${entry.slug}-poster.png` }] : [];
  });
}

export type ShowcaseProduct = ReturnType<typeof selectShowcaseProducts>[number];
