"use client";

import Image from "next/image";
import { useState } from "react";
import { AppWindow } from "lucide-react";
import styles from "./showcase.module.css";

export function ProductPreview({ src, name, priority = false }: {
  src: string; name: string; priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.browser}>
      <div className={styles.browserImage}>
        {failed ? <div className={styles.imageFallback}><AppWindow size={40} /><span>{name}</span></div> : (
          <Image src={src} alt={`Poster giới thiệu ${name} với minh họa 3D và các điểm nổi bật của sản phẩm`} width={1254} height={1254}
            sizes="(max-width: 640px) 85vw, (max-width: 1050px) 42vw, 380px"
            loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined}
            onError={() => setFailed(true)} className={styles.screenshot} />
        )}
      </div>
    </div>
  );
}
