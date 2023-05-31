import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [totaldata, setTotaldata] = useState([])
  const [showdata, setShowData] = useState([])
  const [page, setPage] = useState(1);



  const getCardData = async () => {
    const res = await fetch(
      `https://dummyjson.com/products?limit=100`
    );
    const data = await res.json();
    setTotaldata(data.products);
    setShowData(data.products.slice(page * 20 - 20, page * 20))

  };

  const handelInfiniteScroll = async () => {
    // console.log("scrollHeight" + document.documentElement.scrollHeight);
    // console.log("innerHeight" + window.innerHeight);
    // console.log("scrollTop" + document.documentElement.scrollTop);
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage(prev => Number(prev) + 1)
        console.log(page)
        setShowData((prev) => [...prev, ...totaldata.slice(page * 20 - 20, page * 20)])
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(showdata)


  useEffect(() => {
    getCardData();
  }, []);




  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, [showdata]);

  return (
    <div className="App">
      {
        showdata.map((el, i) => {
          return <div key={i}>
            <img src={el.thumbnail} />
          </div>
        })
      }
    </div>
  );
}

export default App;



/*console.log(page)

  //console.log(totaldata)
  console.log(showdata)

  const handelInfiniteScroll = async () => {
    // console.log("scrollHeight" + document.documentElement.scrollHeight);
    // console.log("innerHeight" + window.innerHeight);
    // console.log("scrollTop" + document.documentElement.scrollTop);
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
        console.log(page)
        setShowData((prev) => [...prev, ...totaldata.slice((page+1) * 10 - 10, page * 20)])
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCardData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, []);*/