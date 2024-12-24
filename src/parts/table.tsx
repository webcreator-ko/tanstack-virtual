import { useVirtualizer } from "@tanstack/react-virtual";
import {
 flexRender,
 getCoreRowModel,
 getSortedRowModel,
 useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import styles from "./table.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";

import { faker } from "@faker-js/faker";

export type Person = {
 id: number;
 firstName: string;
 lastName: string;
 age: number;
 visits: number;
 progress: number;
 status: "relationship" | "complicated" | "single";
 createdAt: Date;
};

const range = (len: number) => {
 const arr: number[] = [];
 for (let i = 0; i < len; i++) {
  arr.push(i);
 }
 return arr;
};

const newPerson = (index: number): Person => {
 return {
  id: index + 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  age: faker.number.int(40),
  visits: faker.number.int(1000),
  progress: faker.number.int(100),
  createdAt: faker.date.past(),
  status: faker.helpers.shuffle<Person["status"]>([
   "relationship",
   "complicated",
   "single",
  ])[0]!,
 };
};

const makeData = (...lens: number[]) => {
 const makeDataLevel = (depth = 0): Person[] => {
  const len = lens[depth]!;
  return range(len).map((d): Person => {
   return {
    ...newPerson(d),
   };
  });
 };

 return makeDataLevel();
};

const Table = () => {
 const [sorting, setSorting] = useState<SortingState>([]);

 const columns = useMemo<Array<ColumnDef<Person>>>(
  () => [
   {
    accessorKey: "id",
    header: "ID",
    size: 60,
   },
   {
    accessorKey: "firstName",
    cell: (info) => info.getValue(),
   },
   {
    accessorFn: (row) => row.lastName,
    id: "lastName",
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
   },
   {
    accessorKey: "age",
    header: () => "Age",
    size: 50,
   },
   {
    accessorKey: "visits",
    header: () => <span>Visits</span>,
    size: 50,
   },
   {
    accessorKey: "status",
    header: "Status",
   },
   {
    accessorKey: "progress",
    header: "Profile Progress",
    size: 80,
   },
   {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) => info.getValue<Date>().toLocaleString(),
   },
  ],
  []
 );

 const [data, setData] = useState<Person[]>([]);

 useEffect(() => {
  const _data = makeData(100);
  setData(_data);
 }, []);

 const table = useReactTable({
  data,
  columns,
  state: {
   sorting,
  },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  debugTable: true,
 });

 const { rows } = table.getRowModel();

 const parentRef = useRef<HTMLDivElement>(null);

 const virtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 34,
  overscan: 20,
 });

 return (
  <div className={styles.wrap}>
   <h2>Table</h2>
   <p>
    テーブルにおいて、CSSの translate
    関数のオフセットの基準は、行の初期位置そのものに基づいています。
    <br />
    そのため、translateY
    のピクセル値を異なる方法で計算し、インデックスに基づいて算出する必要があります。
   </p>
   <div ref={parentRef} className={styles.container}>
    <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
     <table>
      <thead>
       {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
         {headerGroup.headers.map((header) => {
          return (
           <th
            key={header.id}
            colSpan={header.colSpan}
            style={{ width: header.getSize() }}
           >
            {header.isPlaceholder ? null : (
             <div
              {...{
               onClick: header.column.getToggleSortingHandler(),
              }}
             >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{
               asc: " 🔼",
               desc: " 🔽",
              }[header.column.getIsSorted() as string] ?? null}
             </div>
            )}
           </th>
          );
         })}
        </tr>
       ))}
      </thead>
      <tbody>
       {virtualizer.getVirtualItems().map((virtualRow, index) => {
        const row = rows[virtualRow.index];
        return (
         <tr
          key={row.id}
          style={{
           height: `${virtualRow.size}px`,
           transform: `translateY(${
            virtualRow.start - index * virtualRow.size
           }px)`,
          }}
         >
          {row.getVisibleCells().map((cell) => {
           return (
            <td key={cell.id}>
             {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
           );
          })}
         </tr>
        );
       })}
      </tbody>
     </table>
    </div>
   </div>
  </div>
 );
};

export default Table;
