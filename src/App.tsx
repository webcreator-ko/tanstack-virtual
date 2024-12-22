import styles from "./app.module.scss";
import InfiniteScroll from "./parts/infiniteScroll";
import SmoothScroll from "./parts/smoothScroll";

function App() {
 return (
  <div className={styles.wrap}>
   <InfiniteScroll />
   <SmoothScroll />
  </div>
 );
}

export default App;
