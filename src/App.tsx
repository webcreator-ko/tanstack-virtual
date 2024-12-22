import styles from "./app.module.scss";
import InfiniteScroll from "./parts/infiniteScroll";

function App() {
 return (
  <div className={styles.wrap}>
   <InfiniteScroll />
  </div>
 );
}

export default App;
