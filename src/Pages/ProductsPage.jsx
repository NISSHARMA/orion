import { useEffect, useState } from "react"
import TableMap from "../Component/TableMap/TableMap";
import "./ProductsPage.css"
import Filter from "../Component/SortFilter/Filter";
import Sort from "../Component/SortFilter/Sort";
import { GrPowerReset } from 'react-icons/gr';

function ProductsPage() {

  const [totaldata, setTotaldata] = useState([])
  const [showdata, setShowData] = useState([])
  const [filterbyCatagory, setFilterbyCatagory] = useState("")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")
  const [priceSort, setPriceSort] = useState(1)
  const [reviewSort, setReviewSort] = useState(1)


  //_____________Search Function_________________________________//
  async function handleSearch() {
    if (query == "") {
      reset()
      return;
    }
    setSort("")
    setFilterbyCatagory("")
    const res = await fetch(
      `https://dummyjson.com/products/search?q=${query}`
    );
    const data = await res.json();
    setShowData(() => data.products)
    setTotaldata(() => data.products)

  }



  //_____________Get all products data at ones________________________//
  const getCardData = async () => {
    const res = await fetch(
      `https://dummyjson.com/products?limit=100`
    );
    const data = await res.json();
    console.log(data)
    setTotaldata(data.products);
    setShowData(data.products.slice(0, 20))
    setPage(1)
  };

  const handelInfiniteScroll2 = async () => {
    let ele = document.getElementById("tablediv")
    console.log(ele)
    var sh = ele.scrollHeight;
    var st = ele.scrollTop;
    var ht = ele.offsetHeight;

    console.log(st, sh - ht);

    if (st + ht + 1 >= sh && filterbyCatagory == "" && query == "" ) {
      setPage(page + 1)
      setShowData((prev) => totaldata.slice((page + 1) * 20 - 20, (page + 1) * 20))
      ele.scrollTo(0, sh * 0.1)
    }

    if (st == 0 && page >= 2 && filterbyCatagory == "" && query == "") {
      setPage(page - 1)
      setShowData((prev) => totaldata.slice((page - 1) * 20 - 20, (page - 1) * 20))
      let maxScrollY = sh
      ele.scrollTo(0, maxScrollY * 0.8)
    }



  }


  //_______________________Infinite Scrolling Logic_________________________//
  const handelInfiniteScroll = async () => {
    // try {
    //   console.log(window.innerHeight + document.documentElement.scrollTop + 1 >= (document.documentElement.scrollHeight))
    //   if (
    //     window.innerHeight + document.documentElement.scrollTop + 1 >= (document.documentElement.scrollHeight) &&
    //     filterbyCatagory == "" &&
    //     query == ""
    //   ) {
    //     setPage(page + 1)
    //     setShowData((prev) => totaldata.slice((page + 1) * 20 - 20, (page + 1) * 20))
    //     window.scrollTo(0, document.documentElement.scrollHeight * 0.1)
    //   }

    //   if (window.scrollY == 0 && page >= 2 && filterbyCatagory == "" && query == "") {
    //     setPage(page - 1)
    //     setShowData((prev) => totaldata.slice((page - 1) * 20 - 20, (page - 1) * 20))
    //     let maxScrollY = document.documentElement.scrollHeight - document.documentElement.clientHeight
    //     let table = document.getElementById("scrollTable")
    //     window.scrollTo(0, maxScrollY * 0.9)
    //   }


    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    getCardData();
  }, []);


  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, [showdata]);



  //________________ Reset function __________________________//
  function reset() {
    setSort("")
    setFilterbyCatagory("")
    setQuery("")
    getCardData()
  }


  function HandleSorting() {

    if (priceSort == 1) {
      totaldata.sort(function (a, b) {
        return a.price - b.price
      })
      console.log(totaldata)
      setPriceSort(2)
    } else if (priceSort == 2) {
      totaldata.sort(function (a, b) {
        return b.price - a.price
      })
      console.log(totaldata)
      setPriceSort(3)
    } else if (priceSort == 3) {
      setSort("")
      setFilterbyCatagory("")
      setQuery("")
      getCardData()
      setPriceSort(1)
    }

    setTotaldata(totaldata)
    setShowData(totaldata.slice(0, 20))
    setPage(1)

  }

  function HandleReviewSorting() {
    console.log("rating sort")
    if (reviewSort == 1) {
      totaldata.sort(function (a, b) {
        return a.rating - b.rating
      })
      console.log(totaldata)
      setReviewSort(2)
      setTotaldata(totaldata)
      setShowData(totaldata.slice(0, 20))
      setPage(1)

    } else if (reviewSort == 2) {
      totaldata.sort(function (a, b) {
        return b.rating - a.rating
      })
      console.log(totaldata)
      setReviewSort(3)
      setTotaldata(totaldata)
      setShowData(totaldata.slice(0, 20))
      setPage(1)
    } else if (reviewSort == 3) {
      setSort("")
      setFilterbyCatagory("")
      setQuery("")
      getCardData()
      setReviewSort(1)
    }



  }


  return (

    /*__________________Header_______________________________________________________*/
    <div style={{ marginBottom: "100px" }}>
      <div className="sortfiltersearch">
        <div>
          <h1>Products Page</h1>
        </div>

        <div style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
          <div className="sortfilter" >
            <div><Filter setFilterbyCatagory={setFilterbyCatagory} totaldata={totaldata} setShowData={setShowData}
              filterbyCatagory={filterbyCatagory} />
            </div>

            <div> <Sort setPage={setPage}
              filterbyCatagory={filterbyCatagory}
              page={page} totaldata={totaldata}
              setTotaldata={setTotaldata}
              setShowData={setShowData}
              showdata={showdata}
              sort={sort}
              setSort={setSort}
              getCardData={getCardData}
            /></div>


            <div className="reset" onClick={reset}>
              <GrPowerReset style={{ color: "#0CAADA" }} /> <h4>Reset</h4>
            </div>
          </div>

          <div className="search"> <input type="text" value={query} placeholder="Search..." onChange={(e) => setQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>



      { /*__________________Table_______________________________________________________*/}

      <div id="tablediv" className="tablediv" onScroll={handelInfiniteScroll2}>
        {<table id="scrollTable">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th onClick={HandleReviewSorting}>Reviews</th>
              <th onClick={HandleSorting}>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {
              showdata.length > 0 && showdata.map((el, i) => (
                <TableMap {...el} key={i} HandleSorting={HandleSorting} />
              ))
            }
          </tbody>

        </table>}
      </div>



    </div>
  );
}

export default ProductsPage;



