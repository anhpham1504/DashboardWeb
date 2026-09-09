import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, Globe2, LockKeyhole, MoveUpRight } from "lucide-react";
import { ShowcaseFooter } from "./showcase-footer";
import { ShowcaseHeader } from "./showcase-header";
import { ProductPreview } from "./product-preview";
import type { ShowcaseProduct } from "@/lib/showcase";
import styles from "./showcase.module.css";

function ProductCard({ product, index }: { product: ShowcaseProduct; index: number }) {
  return (
    <article className={styles.product}>
      <a href={product.url} target="_blank" rel="noopener noreferrer" className={styles.productLink} aria-label={`Trải nghiệm ${product.name} (mở trong tab mới)`}>
        <div className={styles.stage} data-color={product.color}>
          <div className={styles.stageTop}><span>{product.category}</span><span className={styles.index}>{String(index + 1).padStart(2, "0")} /</span></div>
          <div className={styles.cardPreview}><ProductPreview src={product.image} name={product.name} domain={product.hostname} priority={index < 2} /></div>
          <span className={styles.previewHint}>KHÁM PHÁ SẢN PHẨM <ArrowUpRight size={14} /></span>
        </div>
        <div className={styles.productHeading}><h3>{product.name}</h3><span className={styles.circleArrow}><ArrowUpRight size={23} /></span></div>
        <p className={styles.productDescription}>{product.summary}</p>
        <div className={styles.productBottom}>
          <span>{product.loginRequired ? <><LockKeyhole size={13} /> Cần tài khoản đăng nhập</> : <><Globe2 size={13} /> Ứng dụng web</>}</span>
          <span className={styles.experience}>Trải nghiệm ngay <ArrowUpRight size={14} /></span>
        </div>
      </a>
    </article>
  );
}

export function ShowcasePage({ products }: { products: ShowcaseProduct[] }) {
  const [first, second] = products;
  return (
    <div className={styles.showcase} id="top">
      <a href="#main-content" className={styles.skipLink}>Chuyển đến nội dung chính</a>
      <ShowcaseHeader />
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="showcase-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span /> FPT POLYTECHNIC · DIGITAL SHOWCASE</p>
            <h1 id="showcase-title">Từ ý tưởng<br />sinh viên đến<br /><em>sản phẩm thực tế.</em></h1>
            <p className={styles.heroDescription}>Những ý tưởng được viết thành mã. Những bài toán được giải bằng sáng tạo. Khám phá các sản phẩm số của bộ môn Công nghệ thông tin.</p>
            <a href="#projects" className={styles.primaryCta}>Khám phá sản phẩm <ArrowDown size={17} /></a>
            <div className={styles.heroNote}><span className={styles.codeIcon}><Code2 size={18} /></span><span>Được tạo nên bằng kiến thức,<br /><strong>sự tò mò và tinh thần dám làm.</strong></span></div>
          </div>
          <div className={styles.heroVisual}>
            <span className={styles.visualOrbit} aria-hidden="true" />
            <span className={styles.visualStar} aria-hidden="true">✳</span>
            <span className={styles.visualCaption}>Ý TƯỞNG CÓ HÌNH HÀI.</span>
            {first && <a className={styles.heroPrimary} href={first.url} target="_blank" rel="noopener noreferrer" aria-label={`Khám phá ${first.name} (mở trong tab mới)`}><ProductPreview src={first.image} name={first.name} domain={first.hostname} priority /></a>}
            {second && <a className={styles.heroSecondary} href={second.url} target="_blank" rel="noopener noreferrer" aria-label={`Khám phá ${second.name} (mở trong tab mới)`}><ProductPreview src={second.image} name={second.name} domain={second.hostname} priority /></a>}
            {!first && <div className={styles.emptyVisual}><Code2 size={80} /><span>Không gian cho những ý tưởng mới.</span></div>}
            <div className={styles.visualLabel}><span className={styles.greenDot} /><span>TỪ GIẢNG ĐƯỜNG<br /><strong>ĐẾN TRẢI NGHIỆM THỰC TẾ</strong></span><MoveUpRight size={25} /></div>
            <span className={styles.visualFootnote}>THIẾT KẾ. LẬP TRÌNH. HIỆN THỰC HÓA.</span>
          </div>
        </section>
        <div className={styles.collectionStrip}>
          <span><strong>{String(products.length).padStart(2, "0")}</strong> Sản phẩm trưng bày</span>
          <span><i className={styles.orangeDot} /> Ý tưởng sáng tạo</span>
          <span><i className={styles.blueDot} /> Công nghệ ứng dụng</span>
          <span><i className={styles.greenDot} /> Trải nghiệm thực tế</span>
        </div>
        <section id="projects" className={styles.projects} aria-labelledby="projects-title">
          <div className={styles.sectionIntro}>
            <div><p className={styles.sectionLabel}>01 / BỘ SƯU TẬP SẢN PHẨM</p><h2 id="projects-title">Dấu ấn từ những<br /><span>dòng code.</span></h2></div>
            <p>Mỗi sản phẩm là một cách giải quyết vấn đề.<br className={styles.desktopBreak} /> Chọn một ý tưởng bạn yêu thích và trực tiếp trải nghiệm.</p>
          </div>
          {products.length ? <div className={styles.productGrid}>
            {products.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}
            {products.length % 2 === 1 && <div className={styles.collectionEnd}>
              <span className={styles.endStar} aria-hidden="true">✳</span><p>KHỞI ĐẦU TỪ MỘT CÂU HỎI</p><h3>Điều gì sẽ xảy ra<br />nếu mình thử?</h3>
              <span>Đằng sau mỗi sản phẩm là một hành trình học hỏi, thử nghiệm và cùng nhau tiến bộ.</span>
              <Link href="/about">Gặp tinh thần làm nên sản phẩm <ArrowRight size={17} /></Link>
            </div>}
          </div> : <div className={styles.emptyState}><Code2 size={32} /><h3>Bộ sưu tập đang được chuẩn bị</h3><p>Khám phá các liên kết hiện có trong trang hệ thống.</p><Link href="/systems">Xem tất cả hệ thống <ArrowUpRight size={16} /></Link></div>}
          <div className={styles.directoryLink}><span>Cần truy cập nhanh các công cụ học tập và làm việc?</span><Link href="/systems">Tất cả hệ thống <ArrowUpRight size={16} /></Link></div>
        </section>
      </main>
      <ShowcaseFooter />
    </div>
  );
}
