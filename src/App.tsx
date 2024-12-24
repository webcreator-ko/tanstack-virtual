import styles from "./app.module.scss";
import InfiniteScroll from "./parts/infiniteScroll";
import SmoothScroll from "./parts/smoothScroll";
import Table from "./parts/table";

function App() {
 return (
  <div className={styles.wrap}>
   <InfiniteScroll />
   <SmoothScroll />
   <Table />
  </div>
 );
}

export default App;
