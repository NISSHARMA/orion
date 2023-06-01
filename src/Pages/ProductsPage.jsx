import { useEffect, useState } from "react"
import TableMap from "../Component/TableMap/TableMap";
import "./ProductsPage.css"

function ProductsPage() {
  const [totaldata, setTotaldata] = useState([])
  const [showdata, setShowData] = useState([])
  const [filterbyCatagory, setFilterbyCatagory] = useState("")
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

    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight && page <= 5 && filterbyCatagory == ""
      ) {
        setPage(prev => Number(prev) + 1)
        console.log(page)
        setShowData((prev) => [...prev, ...totaldata.slice(page * 20 - 20, page * 20)])
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
  }, [showdata]);


  function HandleChange(e) {

    let filterdData = totaldata.filter((product) => {
      return product.category === e.target.value

    })
    setShowData(filterdData)
  }



  function HandleSort(e) {
    console.log('invoked')
    let filterdata
    if (filterbyCatagory !== "") {
      filterdata = totaldata.filter((product) => {
        return product.category === filterbyCatagory

      })
      console.log(filterdata)

      if (e.target.value == "htl") {
        let SortData = filterdata.sort(function (a, b) {
          return b.price - a.price
        })
        setTotaldata(SortData)
        setShowData(SortData.slice(page * 20 - 20, page * 20))
        setPage(prev => Number(prev) + 1)
        console.log(SortData)
      } else if (e.target.value == "lth") {
        let SortData = filterdata.sort(function (a, b) {
          return a.price - b.price
        })
        setTotaldata(SortData)
        setShowData(SortData.slice(page * 20 - 20, page * 20))
        setPage(prev => Number(prev) + 1)
        console.log(SortData)
      }

    }

    else {
      if (e.target.value == "htl") {
        let SortData = totaldata.sort(function (a, b) {
          return b.price - a.price
        })
        setTotaldata(SortData)
        setShowData(SortData.slice(page * 20 - 20, page * 20))
        setPage(prev => Number(prev) + 1)
      } else if (e.target.value == "lth") {
        let SortData = totaldata.sort(function (a, b) {
          return a.price - b.price
        })
        setTotaldata(SortData)
        setShowData(SortData.slice(page * 20 - 20, page * 20))
        setPage(prev => Number(prev) + 1)
      }
    }

  }



  return (
    <div >

      <div className="filterdiv">
        <label >Choose By Catagory:</label>
        <select name="cars" id="cars" onChange={prev => {
          setFilterbyCatagory(prev.target.value)
          HandleChange(prev)
        }}>
          <option value="">Choose</option>
          <option value="smartphones">smartphones</option>
          <option value="fragrances">fragrances</option>
          <option value="skincare">skincare</option>
          <option value="groceries">groceries</option>
          <option value="home-decoration">home-decoration</option>
          <option value="tops">tops</option>
        </select>

        <label >Sort By Price</label>
        <select name="" id="" onChange={HandleSort}>
          <option value="" >Choose</option>
          <option value="htl">High To Low</option>
          <option value="lth">Low To High</option>
        </select>



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



