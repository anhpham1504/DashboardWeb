import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight, Code2, Sparkles, Cpu, Globe2 } from "lucide-react";
import { ShowcaseHeader } from "@/components/showcase/showcase-header";
import { ShowcaseFooter } from "@/components/showcase/showcase-footer";
import styles from "@/components/showcase/showcase.module.css";
import aboutStyles from "./about.module.css";
import { MarketingEffects } from "./marketing-effects";

const sources = {
  campus: "https://caodang.fpt.edu.vn/tuyen-sinh-cao-dang-fpt-dong-nai",
  programs: "https://caodang.fpt.edu.vn/ban-tin/nganh-hoc-fpt-polytehcnic-dong-nai.html",
  workshop: "https://caodang.fpt.edu.vn/tin-tuc-poly/workshop-ky-nguyen-ai-hoi-nhap-va-phat-trien-chuan-bi-ky-nang-cho-thoi-dai-cua-ai.html",
  hackathon: "https://caodang.fpt.edu.vn/tin-tuc-poly/nextgen-web-hackathon-2026-fpt-polytechnic-san-choi-hoc-thuat-web-application-cho-sinh-vien-dong-nai.html",
  contact: "https://caodang.fpt.edu.vn/lien-he",
};

const programs = [
  { title: "Phát triển phần mềm", description: "Rèn tư duy lập trình, phân tích bài toán và xây dựng ứng dụng qua các dự án từ cơ bản đến nâng cao.", focus: "Lập trình · Phân tích · Kiểm thử" },
  { title: "Ứng dụng phần mềm", description: "Tìm hiểu nhu cầu người dùng, triển khai phần mềm và hỗ trợ vận hành hệ thống trong doanh nghiệp.", focus: "Triển khai · Vận hành · Hỗ trợ" },
  { title: "Lập trình Web", description: "Học xây dựng giao diện, phát triển hệ thống web và hoàn thiện sản phẩm trực tuyến thông qua thực hành.", focus: "Giao diện · Hệ thống · Website" },
];

const learningSteps = [
  { number: "01", title: "Hiểu bài toán", description: "Xác định nhu cầu, người dùng và mục tiêu của sản phẩm." },
  { number: "02", title: "Thiết kế giải pháp", description: "Chuyển ý tưởng thành luồng trải nghiệm và kế hoạch thực hiện." },
  { number: "03", title: "Lập trình & kiểm thử", description: "Xây dựng từng chức năng, kiểm tra và cải tiến qua phản hồi." },
  { number: "04", title: "Trình bày sản phẩm", description: "Hoàn thiện bản chạy thực tế và chia sẻ kết quả đã tạo ra." },
];

export const metadata: Metadata = {
  title: "Về bộ môn CNTT | FPT Polytechnic Đồng Nai",
  description: "Khám phá bộ môn Công nghệ thông tin tại FPT Polytechnic Đồng Nai: định hướng thực học, các chuyên ngành, hoạt động sinh viên và thông tin cơ sở.",
};

export default function AboutPage() {
  return (
    <div className={`${styles.showcase} ${aboutStyles.marketing}`} id="top">
      <a href="#main-content" className={styles.skipLink}>Chuyển đến nội dung chính</a>
      <ShowcaseHeader />
      <MarketingEffects>
      <main id="main-content">
        <section className={aboutStyles.hero} aria-labelledby="hero-title">
          <div className={aboutStyles.aurora} aria-hidden="true" />
          <div className={aboutStyles.heroInner}>
          <div className={aboutStyles.breadcrumb}>
          <nav aria-label="Đường dẫn trang"><Link href="/">Trang chủ</Link><ChevronRight size={13} /><span aria-current="page">Về bộ môn</span></nav>
          </div>
          <div className={aboutStyles.heroGrid}>
            <div className={aboutStyles.heroCopy}>
              <p className={aboutStyles.eyebrow}><span /> FPT POLYTECHNIC ĐỒNG NAI</p>
              <h1 id="hero-title">Học công nghệ.<br /><span>Tạo khác biệt.</span></h1>
              <p className={aboutStyles.heroDescription}>Bộ môn Công nghệ thông tin — nơi bạn biến sự tò mò thành kỹ năng, ý tưởng thành sản phẩm và đam mê thành dấu ấn riêng.</p>
              <div className={aboutStyles.heroActions}>
                <Link className={aboutStyles.primaryButton} href="/#projects">Khám phá sản phẩm <ArrowUpRight size={20} /></Link>
                <a className={aboutStyles.secondaryButton} href="#programs">Tìm hướng đi của bạn <ArrowRight size={18} /></a>
              </div>
            </div>
            <div className={aboutStyles.heroArt} aria-hidden="true">
              <div className={aboutStyles.orbit} /><div className={aboutStyles.orbitTwo} />
              <div className={aboutStyles.core}><Code2 strokeWidth={1.2} /><span>MAKE IT<br /><b>HAPPEN.</b></span></div>
              <span className={aboutStyles.artStar}>✳</span>
            </div>
          </div>
          <div className={aboutStyles.heroBottom}><a href="#about">Khám phá bộ môn <span>↓</span></a></div>
          </div>
        </section>
        <div className={aboutStyles.marquee} aria-hidden="true"><div className={aboutStyles.marqueeTrack}>{[0, 1].map(i => <span key={i}>THINK BIG <b>✳</b> BUILD REAL <b>✳</b> MAKE YOUR MARK <b>✳</b> FPT POLYTECHNIC <b>✳</b></span>)}</div></div>
        <div className={aboutStyles.quickNavWrap}>
          <nav className={aboutStyles.quickNav} aria-label="Điều hướng nhanh trang Về bộ môn">
            <strong>Khám phá</strong>
            <a href="#about">Tổng quan</a>
            <a href="#journey">Hành trình</a>
            <a href="#programs">Chuyên ngành</a>
            <a href="#activities">Hoạt động</a>
            <a href="#campus">Cơ sở Đồng Nai</a>
          </nav>
        </div>
        <div className={aboutStyles.content}>
        <section id="about" className={aboutStyles.mission} aria-labelledby="about-title" data-reveal>
          <div className={aboutStyles.missionPoster}>
            <h2 id="about-title">Học thật.<br />Làm thật.<br /><span>Tạo dấu ấn.</span></h2>
            <span className={aboutStyles.missionStar} aria-hidden="true">✳</span>
          </div>
          <div className={aboutStyles.missionCopy}>
            <p className={styles.sectionLabel}>THỰC HỌC – THỰC NGHIỆP</p><h3>Học từ bài toán.<br />Trưởng thành từ trải nghiệm.</h3>
            <p>FPT Polytechnic Đồng Nai là một cơ sở của Trường Cao đẳng FPT Polytechnic. Theo định hướng đào tạo của trường, kiến thức nghề nghiệp được gắn với thực hành và phương pháp học qua dự án, giúp người học tích lũy kinh nghiệm ngay trong quá trình học tập.</p>
            <p>Trang bộ môn tập trung giới thiệu ba chuyên ngành Công nghệ thông tin đang được cơ sở Đồng Nai công bố, đồng thời kết nối kiến thức trên lớp với những sản phẩm sinh viên có thể trực tiếp trải nghiệm.</p>
            <a className={aboutStyles.sourceLink} href={sources.campus} target="_blank" rel="noopener noreferrer">Tìm hiểu cơ sở Đồng Nai <ArrowUpRight size={14} aria-hidden="true" /></a>
            <Link href="/#projects" className={styles.aboutLink}>Trải nghiệm thành quả <ArrowUpRight size={18} /></Link>
          </div>
        </section>

          <section id="journey" className={aboutStyles.journey} aria-labelledby="journey-title" data-reveal>
            <div className={aboutStyles.journeyHeading}>
              <p className={styles.sectionLabel}>01 / TỪ BÀI TOÁN ĐẾN SẢN PHẨM</p>
              <h2 id="journey-title">Cách sinh viên tạo nên một sản phẩm.</h2>
              <p>Mỗi dự án là một vòng học tập liên tục: tìm hiểu vấn đề, xây dựng giải pháp, thử nghiệm và hoàn thiện một phiên bản có thể sử dụng.</p>
            </div>
            <ol className={aboutStyles.journeyGrid}>
              {learningSteps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="programs" className={aboutStyles.section} aria-labelledby="programs-title" data-reveal>
            <div className={aboutStyles.sectionHeading}>
              <div><p className={styles.sectionLabel}>02 / CHUYÊN NGÀNH ĐÀO TẠO</p><h2 id="programs-title">Ba chuyên ngành<br />Công nghệ thông tin.</h2></div>
              <p>Tại cơ sở Đồng Nai, ba chuyên ngành CNTT đang được giới thiệu gồm Phát triển phần mềm, Ứng dụng phần mềm và Lập trình Web. Mỗi lựa chọn hướng đến một nhóm kỹ năng và vai trò nghề nghiệp khác nhau.</p>
            </div>
            <div className={aboutStyles.programGrid}>
              {programs.map((program, index) => (
                <article className={aboutStyles.program} key={program.title} data-tone={index}>
                  <div className={aboutStyles.programTop}>{index === 0 ? <Code2 size={32} /> : index === 1 ? <Cpu size={32} /> : <Globe2 size={32} />}</div>
                  <h3>{program.title}</h3><p>{program.description}</p><span className={aboutStyles.focus}>{program.focus}</span>
                </article>
              ))}
            </div>
            <a className={aboutStyles.sourceLink} href={sources.programs} target="_blank" rel="noopener noreferrer">Xem giới thiệu ngành học tại Đồng Nai <ArrowUpRight size={14} aria-hidden="true" /></a>
          </section>

          <section id="activities" className={aboutStyles.activity} aria-labelledby="activity-title" data-reveal>
            <div className={aboutStyles.activityIntro}>
              <p className={styles.sectionLabel}>03 / HOẠT ĐỘNG TIÊU BIỂU</p>
              <h2 id="activity-title">Học qua trải nghiệm và thử thách thực tế.</h2>
              <p>Workshop chuyên môn và sân chơi phát triển sản phẩm giúp sinh viên mở rộng góc nhìn, làm việc theo nhóm và đưa kiến thức vào một bối cảnh cụ thể.</p>
              <div className={aboutStyles.aiGraphic} aria-hidden="true"><span>AI</span><Sparkles size={54} /></div>
            </div>
            <div className={aboutStyles.eventList}>
              <article className={aboutStyles.event}>
                <time dateTime="2026-01-24">24.01.2026 / WORKSHOP</time>
                <h3>Kỷ nguyên AI – Hội nhập và phát triển</h3>
                <p>Workshop dành cho sinh viên Công nghệ thông tin, Thiết kế đồ họa và Thương mại điện tử, tập trung vào xu hướng AI, ứng dụng thực tế cùng những cơ hội và thách thức trong thời kỳ chuyển đổi số.</p>
                <a className={aboutStyles.sourceLink} href={sources.workshop} target="_blank" rel="noopener noreferrer">Đọc bài viết workshop <ArrowUpRight size={14} aria-hidden="true" /></a>
              </article>
              <article className={aboutStyles.event}>
                <time dateTime="2026-01-30">30.01–24.04.2026 / HACKATHON</time>
                <h3>NextGen Web Hackathon 2026</h3>
                <p>Sân chơi phát triển Web Application theo nhóm từ 3–5 sinh viên, xoay quanh các bài toán quản lý nhân sự, công việc, kho, vận tải và nhiều ý tưởng ứng dụng khác.</p>
                <a className={aboutStyles.sourceLink} href={sources.hackathon} target="_blank" rel="noopener noreferrer">Xem thông tin cuộc thi <ArrowUpRight size={14} aria-hidden="true" /></a>
              </article>
            </div>
          </section>

          <section id="campus" className={aboutStyles.contact} aria-labelledby="campus-title" data-reveal>
            <div>
              <p className={styles.sectionLabel}>04 / CƠ SỞ ĐỒNG NAI</p>
              <h2 id="campus-title">Thông tin cơ sở<br />FPT Polytechnic Đồng Nai.</h2>
              <p>Tìm hiểu môi trường học tập, trao đổi về ngành học và nhận tư vấn trực tiếp từ văn phòng tuyển sinh của cơ sở.</p>
              <a className={aboutStyles.sourceLink} href={sources.contact} target="_blank" rel="noopener noreferrer">Thông tin liên hệ chính thức <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <dl className={aboutStyles.contactDetails}>
              <div><dt>ĐỊA CHỈ</dt><dd><address>193 Đỗ Văn Thi, phường Trấn Biên,<br />tỉnh Đồng Nai</address></dd></div>
              <div><dt>TƯ VẤN TUYỂN SINH</dt><dd><a href="tel:0345690031">0345 690 031</a><span aria-hidden="true"> / </span><a href="tel:0989871031">0989 871 031</a></dd></div>
              <div><dt>WEBSITE NHÀ TRƯỜNG</dt><dd><a href={sources.campus} target="_blank" rel="noopener noreferrer">FPT Polytechnic · Cơ sở Đồng Nai <ArrowUpRight size={16} aria-hidden="true" /></a></dd></div>
            </dl>
          </section>

          <section className={aboutStyles.discover} aria-labelledby="discover-title" data-reveal>
            <span className={aboutStyles.ctaStar} aria-hidden="true">✳</span>
            <div><p className={styles.sectionLabel}>ĐỪNG CHỈ TƯỞNG TƯỢNG.</p><h2 id="discover-title">Chạm vào ý tưởng.<br /><span>Khám phá chất riêng.</span></h2><p>Mỗi sản phẩm là một khởi đầu. Biết đâu, ý tưởng tiếp theo là của bạn?</p></div>
            <Link className={aboutStyles.primaryButton} href="/#projects">Xem sản phẩm sinh viên <ArrowUpRight size={20} aria-hidden="true" /></Link>
          </section>
          <p className={aboutStyles.sourceNote}>Nội dung được đối chiếu với website chính thức của FPT Polytechnic, cập nhật ngày 10/09/2026. Chương trình đào tạo và thông tin tuyển sinh có thể thay đổi theo từng đợt; vui lòng xem nguồn được liên kết tại mỗi mục.</p>
        </div>
      </main>
      </MarketingEffects>
      <ShowcaseFooter />
    </div>
  );
}
