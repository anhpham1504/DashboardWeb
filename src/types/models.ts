export type CategoryDto = {
  id: string;
  name: string;
  description: string | null;
  websiteCount: number;
  createdAt: string;
  updatedAt: string;
};

export type WebsiteDto = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  faviconUrl: string | null;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiSuccess<T> = { success: true; data: T; total?: number };
export type ApiFailure = { success: false; error: { code: string; message: string } };
