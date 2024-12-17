import React from "react";
import styles from "./pagination.module.scss";
import PaginationArrowIcon from "../icon/pagination-arrow-icon";

interface PaginationProps {
 currentPage: number;
 totalPages: number;
 onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
 currentPage,
 totalPages,
 onPageChange,
}) => {
 const renderPageNumbers = () => {
  const pageNumbers = [];
  const showEllipsis = totalPages > 5;

  if (showEllipsis) {
   if (currentPage < 3) {
    for (let i = 1; i <= 3; i++) {
     pageNumbers.push(
      <button
       key={i}
       onClick={() => onPageChange(i)}
       className={`${styles.pageButton} ${
        currentPage === i ? styles.active : ""
       }`}
      >
       {i}
      </button>
     );
    }
    pageNumbers.push(<span key="ellipsis">...</span>);
    pageNumbers.push(
     <button
      key={totalPages}
      onClick={() => onPageChange(totalPages)}
      className={styles.pageButton}
     >
      {totalPages}
     </button>
    );
   } else if (currentPage > totalPages - 2) {
    pageNumbers.push(
     <button
      key={1}
      onClick={() => onPageChange(1)}
      className={styles.pageButton}
     >
      1
     </button>
    );
    pageNumbers.push(<span key="ellipsis">...</span>);
    for (let i = totalPages - 2; i <= totalPages; i++) {
     pageNumbers.push(
      <button
       key={i}
       onClick={() => onPageChange(i)}
       className={`${styles.pageButton} ${
        currentPage === i ? styles.active : ""
       }`}
      >
       {i}
      </button>
     );
    }
   } else {
    pageNumbers.push(
     <button
      key={1}
      onClick={() => onPageChange(1)}
      className={styles.pageButton}
     >
      1
     </button>
    );
    pageNumbers.push(<span key="ellipsis1">...</span>);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
     pageNumbers.push(
      <button
       key={i}
       onClick={() => onPageChange(i)}
       className={`${styles.pageButton} ${
        currentPage === i ? styles.active : ""
       }`}
      >
       {i}
      </button>
     );
    }
    pageNumbers.push(<span key="ellipsis2">...</span>);
    pageNumbers.push(
     <button
      key={totalPages}
      onClick={() => onPageChange(totalPages)}
      className={styles.pageButton}
     >
      {totalPages}
     </button>
    );
   }
  } else {
   for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(
     <button
      key={i}
      onClick={() => onPageChange(i)}
      className={`${styles.pageButton} ${
       currentPage === i ? styles.active : ""
      }`}
     >
      {i}
     </button>
    );
   }
  }

  return pageNumbers;
 };

 return (
  <div className={`${styles.pagination} p1`}>
   <button
    onClick={() => onPageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={styles.arrowButton}
   >
    <PaginationArrowIcon direction="left" />
   </button>
   {renderPageNumbers()}
   <button
    onClick={() => onPageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={styles.arrowButton}
   >
    <PaginationArrowIcon direction="right" />
   </button>
  </div>
 );
};

export default Pagination;
