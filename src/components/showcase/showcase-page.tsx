import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, LockKeyhole } from "lucide-react";
import { ShowcaseFooter } from "./showcase-footer";
import { ShowcaseHeader } from "./showcase-header";
import { ProductPreview } from "./product-preview";
import type { Product } from "@/data/products";
import { assetPath } from "@/lib/base-path";
import styles from "./showcase.module.css";

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <article className={styles.product} data-color={product.color}>
      <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className={styles.productLink} aria-label={`Trải nghiệm ${product.name} (mở trong tab mới)`}>
        <div className={styles.stage} data-color={product.color}>
          <div className={styles.stageTop}><span>{product.category}</span></div>
          <div className={styles.cardPreview}><ProductPreview src={assetPath(product.poster)} name={product.name} priority={index < 2} /></div>
        </div>
        <div className={styles.productHeading}><h3>{product.name}</h3><span className={styles.circleArrow}><ArrowUpRight size={23} /></span></div>
        <p className={styles.productDescription}>{product.description}</p>
        {product.loginRequired && <div className={styles.productBottom}><span><LockKeyhole size={13} /> Cần tài khoản đăng nhập</span></div>}
      </a>
    </article>
  );
}

export function ShowcasePage({ products }: { products: Product[] }) {
  const [first, second] = products;
  return (
    <div className={styles.showcase} id="top">
      <a href="#main-content" className={styles.skipLink}>Chuyển đến nội dung chính</a>
      <ShowcaseHeader />
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="showcase-title">
          <div className={styles.heroCopy}>
            <h1 id="showcase-title">Từ ý tưởng<br />sinh viên đến<br /><em>sản phẩm thực tế.</em></h1>
            <p className={styles.heroDescription}>Những ý tưởng được viết thành mã. Những bài toán được giải bằng sáng tạo. Khám phá các sản phẩm số của bộ môn Công nghệ thông tin.</p>
            <a href="#projects" className={styles.primaryCta}>Khám phá sản phẩm <ArrowDown size={17} /></a>
          </div>
          <div className={styles.heroVisual}>
            <span className={styles.visualOrbit} aria-hidden="true" />
            <span className={styles.visualStar} aria-hidden="true">✳</span>
            {first && <a className={styles.heroPrimary} href={first.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`Khám phá ${first.name} (mở trong tab mới)`}><ProductPreview src={assetPath(first.poster)} name={first.name} priority /></a>}
            {second && <a className={styles.heroSecondary} href={second.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`Khám phá ${second.name} (mở trong tab mới)`}><ProductPreview src={assetPath(second.poster)} name={second.name} priority /></a>}
            {!first && <div className={styles.emptyVisual}><Code2 size={80} /><span>Không gian cho những ý tưởng mới.</span></div>}
          </div>
        </section>
        <div className={styles.collectionStrip}>
          <span><i className={styles.orangeDot} aria-hidden="true" />Sản phẩm trưng bày</span>
          <span><i className={styles.orangeDot} aria-hidden="true" />Ý tưởng sáng tạo</span>
          <span><i className={styles.blueDot} aria-hidden="true" />Công nghệ ứng dụng</span>
          <span><i className={styles.greenDot} aria-hidden="true" />Trải nghiệm thực tế</span>
        </div>
        <section id="projects" className={styles.projects} aria-labelledby="projects-title">
          <div className={styles.sectionIntro}>
            <div><p className={styles.sectionLabel}>01 / BỘ SƯU TẬP SẢN PHẨM</p><h2 id="projects-title">Dấu ấn từ những<br /><span>dòng code.</span></h2></div>
            <p>Mỗi sản phẩm là một cách giải quyết vấn đề.<br className={styles.desktopBreak} /> Chọn một ý tưởng bạn yêu thích và trực tiếp trải nghiệm.</p>
          </div>
          {products.length ? <div className={styles.productGrid}>
            {products.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}
            {products.length % 2 === 1 && <div className={styles.collectionEnd}>
              <span className={styles.endStar} aria-hidden="true">✳</span><h3>Điều gì sẽ xảy ra<br />nếu mình thử?</h3>
              <span>Đằng sau mỗi sản phẩm là một hành trình học hỏi, thử nghiệm và cùng nhau tiến bộ.</span>
              <Link href="/about">Gặp tinh thần làm nên sản phẩm <ArrowRight size={17} /></Link>
            </div>}
          </div> : <div className={styles.emptyState}><Code2 size={32} /><h3>Bộ sưu tập đang được chuẩn bị</h3><p>Khám phá các liên kết hiện có trong trang hệ thống.</p><Link href="/systems">Xem tất cả hệ thống <ArrowUpRight size={16} /></Link></div>}
          <div className={styles.directoryLink}><Link href="/systems">Mở tất cả hệ thống <ArrowUpRight size={16} /></Link></div>
        </section>
      </main>
      <ShowcaseFooter />
    </div>
  );
}
