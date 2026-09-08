const defaultCategoryNames: Record<string, string> = {
  "ai tools": "Công cụ AI",
  development: "Lập trình",
  entertainment: "Giải trí",
  study: "Học tập",
  work: "Công việc",
  uncategorized: "Chưa phân loại",
};

const defaultCategoryDescriptions: Record<string, string> = {
  "artificial intelligence products and assistants":
    "Công cụ và trợ lý trí tuệ nhân tạo",
  "tools and resources for building software":
    "Công cụ và tài nguyên phát triển phần mềm",
  "media and entertainment": "Nội dung truyền thông và giải trí",
  "learning resources": "Tài nguyên phục vụ học tập",
  "productivity and collaboration tools":
    "Công cụ làm việc và cộng tác",
};

const defaultWebsiteDescriptions: Record<string, string> = {
  "ai assistant for everyday work": "Trợ lý AI hỗ trợ học tập và công việc",
  "build and ship software together": "Nền tảng lưu trữ và quản lý mã nguồn",
  "developer questions and answers": "Cộng đồng hỏi đáp dành cho lập trình viên",
  "store, share, and collaborate on files":
    "Lưu trữ, chia sẻ và cộng tác trên tài liệu",
  "anh em motor administration portal": "Cổng quản trị Anh Em Motor",
  "interview management application": "Ứng dụng quản lý phỏng vấn",
  "v-shield application": "Ứng dụng V-Shield",
  "english learning application": "Ứng dụng học tiếng Anh",
  "agent administration portal": "Cổng quản trị hệ thống Agent",
};

const apiMessages: Record<string, string> = {
  "Website name is required.": "Tên website không được để trống.",
  "URL is required.": "Vui lòng nhập đường dẫn website.",
  "Enter a valid http or https URL.":
    "Đường dẫn website không hợp lệ. Chỉ hỗ trợ HTTP hoặc HTTPS.",
  "Only http and https URLs are allowed.":
    "Chỉ hỗ trợ đường dẫn HTTP hoặc HTTPS.",
  "Category name is required.": "Vui lòng nhập tên danh mục.",
  "A category with this name already exists.": "Tên danh mục đã tồn tại.",
  "This value already exists.": "Giá trị này đã tồn tại.",
  "Website not found.": "Không tìm thấy website.",
  "Category not found.": "Không tìm thấy danh mục.",
  "Invalid input.": "Thông tin đã nhập chưa hợp lệ.",
  "Something went wrong. Please try again.":
    "Có lỗi xảy ra. Vui lòng thử lại.",
  "Request failed.": "Không thể hoàn tất yêu cầu.",
};

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function getCategoryDisplayName(name?: string | null) {
  if (!name) return "Chưa phân loại";
  return defaultCategoryNames[name.trim().toLowerCase()] ?? name;
}

export function getCategoryDisplayDescription(
  description?: string | null
) {
  if (!description) return "Chưa có mô tả.";
  return (
    defaultCategoryDescriptions[description.trim().toLowerCase()] ?? description
  );
}

export function getWebsiteDisplayDescription(
  description?: string | null
) {
  if (!description) return "Chưa có mô tả.";
  return (
    defaultWebsiteDescriptions[description.trim().toLowerCase()] ?? description
  );
}

export function getUserError(reason: unknown, fallback: string) {
  if (!(reason instanceof Error)) return fallback;
  return apiMessages[reason.message.trim()] ?? fallback;
}
