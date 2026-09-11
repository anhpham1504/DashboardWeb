export type ProductColor = "blue" | "lavender" | "sand" | "mint" | "peach";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  poster: string;
  logo: string;
  websiteUrl: string;
  keywords: string[];
  featured: boolean;
  loginRequired: boolean;
  color: ProductColor;
  sortOrder: number;
};

export const products: Product[] = [
  {
    id: "shb-agents",
    slug: "shb-agents",
    name: "SHB Agents",
    description:
      "Cổng quản trị hệ thống vận tải SHB Agents, tập trung các nghiệp vụ vận hành trong một không gian làm việc.",
    category: "Quản trị & Vận tải",
    poster: "/showcase/shb-agents-poster.png",
    logo: "/software-icons/shb-agents.jpg",
    websiteUrl: "https://shbagents.site/admin/login",
    keywords: ["agent", "vận tải", "vận hành", "quản trị"],
    featured: true,
    loginRequired: true,
    color: "blue",
    sortOrder: 1,
  },
  {
    id: "victionary",
    slug: "victionary",
    name: "Victionary English",
    description:
      "Mở rộng vốn từ tiếng Anh với từ điển học thuật, trợ lý AI và ôn tập thông minh.",
    category: "Học tập & Ngôn ngữ",
    poster: "/showcase/victionary-poster.png",
    logo: "/software-icons/victionary.png",
    websiteUrl: "https://victionaryenglish.com/",
    keywords: ["tiếng Anh", "từ điển", "AI", "ôn tập", "học tập"],
    featured: true,
    loginRequired: false,
    color: "lavender",
    sortOrder: 2,
  },
  {
    id: "v-shield",
    slug: "v-shield",
    name: "V-Shield",
    description:
      "Khám phá giải pháp kiểm soát an ninh tích hợp nhận diện khuôn mặt, mã QR và giám sát thông minh.",
    category: "Công nghệ & An ninh",
    poster: "/showcase/v-shield-poster.png",
    logo: "/software-icons/v-shield.svg",
    websiteUrl: "https://v-shield.site/",
    keywords: ["an ninh", "nhận diện khuôn mặt", "QR", "giám sát"],
    featured: true,
    loginRequired: false,
    color: "sand",
    sortOrder: 3,
  },
  {
    id: "my-interview",
    slug: "my-interview",
    name: "My Interview",
    description:
      "Luyện phỏng vấn theo CV và công việc mục tiêu, nhận phản hồi để tự tin hơn từng câu trả lời.",
    category: "AI & Nghề nghiệp",
    poster: "/showcase/my-interview-poster.png",
    logo: "/software-icons/my-interview.svg",
    websiteUrl: "https://myinterview.hzi.io.vn/",
    keywords: ["phỏng vấn", "CV", "nghề nghiệp", "AI", "phản hồi"],
    featured: true,
    loginRequired: false,
    color: "mint",
    sortOrder: 4,
  },
  {
    id: "anh-em-motor",
    slug: "anh-em-motor",
    name: "Anh Em Motor",
    description:
      "Không gian quản trị dành cho Anh Em Motor, kết nối công nghệ với hoạt động kinh doanh xe máy.",
    category: "Quản trị & Kinh doanh",
    poster: "/showcase/anh-em-motor-poster.png",
    logo: "/software-icons/anh-em-motor.ico",
    websiteUrl: "https://admin.anhemmotor.online/",
    keywords: ["xe máy", "kinh doanh", "quản trị", "motor"],
    featured: true,
    loginRequired: true,
    color: "peach",
    sortOrder: 5,
  },
];

export const productCategories = Array.from(
  new Set(products.map((product) => product.category)),
).map((name) => ({
  id: name,
  name,
  websiteCount: products.filter((product) => product.category === name).length,
}));

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
