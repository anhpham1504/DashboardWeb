import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/layout/app-header";
import styles from "./showcase.module.css";

export function ShowcaseFooter() {
  return (
      <footer className={styles.footer}>
        <div className={styles.footerTop}><div><Brand /><p>Không gian trưng bày sản phẩm số<br />Bộ môn Công nghệ thông tin</p></div><div className={styles.footerMessage}>Ý tưởng của sinh viên.<br /><span>Trải nghiệm dành cho bạn.</span></div><a href="#top" className={styles.backTop} aria-label="Về đầu trang"><ArrowUpRight size={23} /></a></div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} FPT Polytechnic</span><nav aria-label="Điều hướng chân trang"><Link href="/#projects">Sản phẩm</Link><Link href="/about">Về bộ môn</Link><Link href="/systems">Quản lý hệ thống <ArrowUpRight size={12} /></Link></nav><span className={styles.footerSignature}>BUILT WITH CURIOSITY <span>✳</span></span></div>
      </footer>
  );
}
