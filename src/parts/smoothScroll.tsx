import { elementScroll, useVirtualizer } from "@tanstack/react-virtual";
import type { VirtualizerOptions } from "@tanstack/react-virtual";
import styles from "./smoothScroll.module.scss";
import { useCallback, useRef } from "react";

export const easeInOutQuint = (t: number) => {
 return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
};

const SmoothScroll = () => {
 const parentRef = useRef<HTMLDivElement>(null);
 const scrollingRef = useRef<number>();

 /**
  * 
  * offset: number
    スクロール先のピクセルオフセット。
    
    options: { behavior?: 'auto' | 'smooth' }
    スクロール方法（即時スクロールかスムーズスクロールか）。

    instance: Virtualizer<TScrollElement, TItemElement>
    Virtualizer のインスタンス（仮想化リスト全体の情報を保持）。
  */
 const scrollToFn: VirtualizerOptions<
  HTMLDivElement,
  HTMLDivElement
 >["scrollToFn"] = useCallback((offset, options, instance) => {
  console.log("offset", offset);
  console.log("options", options);
  console.log("instance", instance);

  const duration = 1000;
  const start = parentRef.current?.scrollTop || 0;
  const startTime = (scrollingRef.current = Date.now());

  const run = () => {
   if (scrollingRef.current !== startTime) return;
   const now = Date.now();
   const elapsed = now - startTime;
   const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
   const interpolated = start + (offset - start) * progress;

   if (elapsed < duration) {
    elementScroll(interpolated, options, instance);
    requestAnimationFrame(run);
   } else {
    elementScroll(interpolated, options, instance);
   }
  };

  requestAnimationFrame(run);
 }, []);

 const rowVirtualizer = useVirtualizer({
  count: 10000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
  overscan: 5,
  scrollToFn,
 });

 const handleToScroll = () => {
  rowVirtualizer.scrollToIndex(40);
 };

 return (
  <div className={styles.wrap}>
   <h2>Smooth Scroll</h2>
   <p>
    このスムーズスクロールの例では、<code>scrollToFn</code> を使用して、
    <code>scrollToIndex</code> や <code>scrollToOffset</code>
    といったメソッドのためのカスタムスクロール機能を実装しています。
   </p>
   <br />
   <div>
    <button onClick={handleToScroll}>Scroll To Index</button>
   </div>
   <br />
   <div
    ref={parentRef}
    className={styles.list}
    style={{
     height: `200px`,
     overflow: "auto",
    }}
   >
    <div
     style={{
      height: `${rowVirtualizer.getTotalSize()}px`,
      width: "100%",
      position: "relative",
     }}
    >
     {rowVirtualizer.getVirtualItems().map((virtualRow) => (
      <div
       key={virtualRow.index}
       className={
        virtualRow.index % 2 ? styles.listItemOdd : styles.listItemEven
       }
       style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
       }}
      >
       Row {virtualRow.index}
      </div>
     ))}
    </div>
   </div>
  </div>
 );
};

export default SmoothScroll;
