import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import styles from "./infiniteScroll.module.scss";
import { useVirtualizer } from "@tanstack/react-virtual";

async function fetchServerPage(
 // データの件数（ここでは10件）
 limit: number,
 // ページのオフセット（開始位置）
 offset: number = 0
): Promise<{ rows: Array<string>; nextOffset: number }> {
 console.log("offset", offset);
 const rows = new Array(limit)
  .fill(0)
  .map((_, i) => `Async loaded row #${i + offset * limit}`);

 await new Promise((r) => setTimeout(r, 500));

 return { rows, nextOffset: offset + 1 };
}

const InfiniteScroll = () => {
 const {
  // クエリの現在の状態（loading, success, errorなど）
  status,
  // クエリから取得したデータ
  data,
  // クエリがエラーになった場合のエラーオブジェクト
  error,
  // クエリが現在データを取得中かどうかを示すフラグ
  isFetching,
  // 次のページのデータを取得中かどうかを示すフラグ
  isFetchingNextPage,
  // 次のページを取得するための関数
  fetchNextPage,
  // 次のページが存在するかどうかを示すフラグ
  hasNextPage,
 } = useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: (ctx) => fetchServerPage(10, ctx.pageParam),
  // 次のページのパラメータを取得する関数
  getNextPageParam: (lastGroup) => lastGroup.nextOffset,
  // 初期ページのパラメータ
  initialPageParam: 0,
 });

 const allRows = data ? data.pages.flatMap((d) => d.rows) : [];

 const parentRef = React.useRef<HTMLDivElement>(null);

 const rowVirtualizer = useVirtualizer({
  // トータルの表示数
  count: hasNextPage ? allRows.length + 1 : allRows.length,
  getScrollElement: () => parentRef.current,
  // 仮想化が縦方向の場合 → 高さを返します。
  // 仮想化が横方向の場合 → 横幅を返します。
  // この挙動は Virtualizer の方向設定に依存します。
  estimateSize: () => 100,
  // 次に表示する数
  overscan: 5,
 });

 useEffect(() => {
  const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

  if (!lastItem) {
   return;
  }

  console.log("allRows", allRows.length);
  console.log("lastItem", lastItem.index);

  //  useInfiniteQuery で次のデータを取得する際の条件として、以下の 3つの条件 が一般的です。
  // これらは、無限スクロールやページネーションのデータ取得ロジックでよく使用されます

  // 1. 最後のアイテムが表示されているか (lastItem.index >= allRows.length - 1)
  // 目的: 現在のリストの最後のアイテムが表示されていることを確認します。
  // 理由: 最後のアイテムが表示されていない場合は、次のデータを取得する必要がないため。

  // 2. 次のデータが存在するか (hasNextPage)
  // 目的: サーバー側で次のページが存在するかどうかを確認します。
  // 理由: 次のデータがない場合は、それ以上リクエストを送る必要がありません。
  // 補足: useInfiniteQuery の getNextPageParam を正しく設定していれば、hasNextPage が自動的に判定されます。

  // 3. データ取得中でないこと (!isFetchingNextPage)
  // 目的: 現在すでに次のデータを取得中でないことを確認します。
  // 理由: 同時に複数回のリクエストが送られるのを防ぎます（重複リクエスト防止）。

  // これ以外の条件が必要な場合
  // 特定のユースケースによっては、他の条件が追加される場合もあります。
  // 1. スクロール位置の確認
  // 例: スクロール位置がリストの一番下に近い場合のみ、次のデータを取得する。
  // 条件例: scrollPosition >= scrollHeight - threshold
  // 用途: ユーザーがスクロールするまでデータを取得しない、より効率的な無限スクロール実装。
  // 2. 特定のフィルタ条件
  // 例: フィルタや検索条件が変更された場合にデータ取得をリセットし、条件に合うデータを再取得する。

  // 結論
  // useInfiniteQuery で次のデータを取得する条件は、上記の 3つが基本 ですが、ユースケースによっては追加の条件が必要になる場合もあります。
  // ただし、これらの3条件が無限スクロールの基本であり、ほとんどの場合これで十分です。

  if (
   // 最後のアイテムが全体のデータの最後に到達しているか
   lastItem.index >= allRows.length - 1 &&
   // さらにデータを取得する必要があるか
   hasNextPage &&
   // 現在次のページを取得中でないか
   !isFetchingNextPage
  ) {
   fetchNextPage();
  }
 }, [
  hasNextPage,
  fetchNextPage,
  allRows.length,
  isFetchingNextPage,
  rowVirtualizer.getVirtualItems(),
 ]);

 return (
  <div>
   <h2>Infinite Scroll</h2>
   <p>
    この無限スクロールの例では、React Query の useInfiniteScroll
    フックを使用して投稿エンドポイントから無限データを取得します。
    <br />
    そして、リストの下部に配置されたローダーロウとともに rowVirtualizer
    を使用して、次のページの読み込みをトリガーします。
   </p>
   <br />
   <br />
   {status === "pending" ? (
    <p>Loading...</p>
   ) : status === "error" ? (
    <span>Error: {error.message}</span>
   ) : (
    <div
     ref={parentRef}
     className={styles.list}
     style={{
      height: `500px`,
      width: `100%`,
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
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
       const isLoaderRow = virtualRow.index > allRows.length - 1;
       const post = allRows[virtualRow.index];

       return (
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
         {isLoaderRow
          ? hasNextPage
            ? "Loading more..."
            : "Nothing more to load"
          : post}
        </div>
       );
      })}
     </div>
    </div>
   )}
   <div>
    {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
   </div>
  </div>
 );
};

export default InfiniteScroll;
