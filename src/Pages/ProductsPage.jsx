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
    setTotaldata(data.products);
    setShowData(data.products.slice(0, 20))
    setPage(2)
  };




  //_______________________Infinite Scrolling Logic_________________________//
  const handelInfiniteScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight && page <= 5 && filterbyCatagory == "" && query == ""
      ) {
        setPage(prev => Number(prev) + 1)
        setShowData((prev) => [...prev, ...totaldata.slice(page * 20 - 20, page * 20)])
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCardData();
  }, []);





  //_________________Scroll Event Listner_____________________//
  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, [showdata, query]);





  //________________ Reset function __________________________//
  function reset() {
    setSort("")
    setFilterbyCatagory("")
    setQuery("")
    getCardData()
  }



  return (
    <div style={{ marginBottom: "80px" }}>

      <div className="sortfiltersearch">
        <div className="sortfilter">
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
          /></div>


          <div className="reset" onClick={reset}>
            <GrPowerReset style={{ color: "#0CAADA" }} /> <h4>Reset</h4>
          </div>
        </div>

        <div className="search"> <input type="text" value={query} placeholder="Search..." onChange={(e) => setQuery(e.target.value)} />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <table>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Reviews</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>

        {
          showdata.length > 0 && showdata.map((el, i) => (
            <TableMap {...el} key={i} />
          ))
        }

      </table>

    </div>
  );
}

export default ProductsPage;



