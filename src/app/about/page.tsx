import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight, MoveUpRight } from "lucide-react";
import { ShowcaseHeader } from "@/components/showcase/showcase-header";
import { ShowcaseFooter } from "@/components/showcase/showcase-footer";
import styles from "@/components/showcase/showcase.module.css";

export const metadata: Metadata = {
  title: "Về bộ môn CNTT | FPT Polytechnic",
  description: "Tinh thần học thật, làm thật của sinh viên bộ môn Công nghệ thông tin, FPT Polytechnic — từ ý tưởng đến sản phẩm thực tế.",
};

export default function AboutPage() {
  return (
    <div className={styles.showcase} id="top">
      <a href="#main-content" className={styles.skipLink}>Chuyển đến nội dung chính</a>
      <ShowcaseHeader />
      <main id="main-content" className={styles.aboutPage}>
        <div className={styles.aboutIntro}>
          <nav aria-label="Đường dẫn trang"><Link href="/">Trang chủ</Link><ChevronRight size={13} /><span aria-current="page">Về bộ môn</span></nav>
          <p className={styles.sectionLabel}>FPT POLYTECHNIC / CÔNG NGHỆ THÔNG TIN</p>
          <h1>Về bộ môn</h1>
          <p>Đằng sau mỗi sản phẩm là một hành trình học hỏi, sáng tạo và cùng nhau trưởng thành.</p>
        </div>
        <section id="about" className={styles.about} aria-labelledby="about-title">
          <div className={styles.aboutPoster}>
            <span className={styles.posterLabel}>FPT POLYTECHNIC / CNTT</span><h2 id="about-title">Học thật.<br />Làm thật.<br /><span>Tạo dấu ấn.</span></h2>
            <span className={styles.posterArrow} aria-hidden="true"><MoveUpRight strokeWidth={1.1} /></span><span className={styles.posterFoot}>TỪ NHỮNG DÒNG CODE ĐẦU TIÊN.</span>
          </div>
          <div className={styles.aboutCopy}>
            <p className={styles.sectionLabel}>TINH THẦN BỘ MÔN</p><h3>Công nghệ bắt đầu từ con người.</h3>
            <p>Không gian này giới thiệu các sản phẩm của sinh viên bộ môn Công nghệ thông tin, FPT Polytechnic — nơi kiến thức được kết nối với những bài toán trong học tập, công việc và cuộc sống.</p>
            <p>Từ phác thảo ý tưởng, thiết kế trải nghiệm đến xây dựng ứng dụng, mỗi sản phẩm là một dấu mốc trên hành trình trưởng thành của người làm công nghệ.</p>
            <div className={styles.process}><span><b>01</b> Khám phá</span><ArrowRight size={16} /><span><b>02</b> Xây dựng</span><ArrowRight size={16} /><span><b>03</b> Chia sẻ</span></div>
            <Link href="/#projects" className={styles.aboutLink}>Trải nghiệm thành quả <ArrowUpRight size={18} /></Link>
          </div>
        </section>
      </main>
      <ShowcaseFooter />
    </div>
  );
}
