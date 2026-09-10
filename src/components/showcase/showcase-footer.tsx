import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/layout/app-header";
import styles from "./showcase.module.css";

export function ShowcaseFooter() {
  return (
      <footer className={styles.footer} aria-label="Chân trang">
        <div className={styles.footerPanel}>
          <div className={styles.footerTop}>
            <div className={styles.footerLead}>
              <div className={styles.footerBrandMark}><Brand /></div>
              <p className={styles.footerKicker}>BỘ MÔN CÔNG NGHỆ THÔNG TIN · CƠ SỞ ĐỒNG NAI</p>
              <div className={styles.footerMessage}>Ý tưởng của sinh viên.<br /><span>Trải nghiệm dành cho bạn.</span></div>
              <p className={styles.footerDescription}>Nơi những kiến thức trên lớp được phát triển thành sản phẩm số có thể trải nghiệm và tiếp tục hoàn thiện.</p>
            </div>

            <div className={styles.footerLinks}>
              <nav aria-label="Khám phá">
                <strong>Khám phá</strong>
                <Link href="/#projects">Sản phẩm</Link>
                <Link href="/about">Về bộ môn</Link>
              </nav>
              <nav aria-label="Hệ thống">
                <strong>Hệ thống</strong>
                <Link href="/systems">Tất cả hệ thống</Link>
                <Link href="/categories">Danh mục</Link>
              </nav>
            </div>

            <a href="#top" className={styles.backTop} aria-label="Về đầu trang">
              <span>Về đầu trang</span><ArrowUpRight size={21} />
            </a>
          </div>

          <div className={styles.footerBottom}>
            <span>© {new Date().getFullYear()} FPT Polytechnic</span>
            <span>Sản phẩm học tập · Trải nghiệm thực tế · Sáng tạo cùng công nghệ</span>
          </div>
        </div>
      </footer>
  );
}
