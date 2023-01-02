import React,{useState,useEffect} from 'react'
import axios from 'axios'
import './Home.css'

const Home = () => {
    const [formData,setFormData]=useState({
        "product_name":"",
        "original_price":"",
        "sale_price":"",
        "product_type":"",
        "description":""
    })

    const[tableData,setTableData] = useState([])
    const [search,setSearch]=useState('')
    const[page,setPage]=useState(1)
    const[count,setCount]=useState(10)

    const{product_name,original_price,sale_price,product_type,description} = formData;

    const getList=async() =>{
        axios.defaults.headers.common={
            "api_key":"Z9Q7WKEY7ORGBUFGN3EG1QS5Y7FG8DU29GHKKSZH"
        }
        const {data} = await axios.get('https://lobster-app-ddwng.ondigitalocean.app/product/list')

        if(data){
            setTableData(data.message)
        }
        
    }

    // On Change Input
    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    console.log(tableData)

    const addData=async(e)=>{
        e.preventDefault();
        axios.defaults.headers.common={
            "api_key":"Z9Q7WKEY7ORGBUFGN3EG1QS5Y7FG8DU29GHKKSZH"
        }
        const {data} = await axios.post('https://lobster-app-ddwng.ondigitalocean.app/product/add_new',formData)

       if(data.success){
        console.log('abc')
       }
    }

     

    const setPageFunc =(selected) =>{
        if(selected >= 1  && selected <= Math.floor(tableData.length) &&  selected !=page){
            setPage(selected)
        }
        
    }


    useEffect(()=>{
     getList();
    },[search])


  return (
    <div className='mainWrapper'>
        <div className='formWrap'>
            <form onSubmit={addData} className='formWrapper'>
            <input type='text' name='product_name' value={product_name} onChange={onChange} placeholder='Product Name'/>
            <input type='text' name='original_price' value={original_price} onChange={onChange} placeholder='Original Price'/>
            <input type='text' name='sale_price' value={sale_price} onChange={onChange} placeholder='Sale Price'/>
            <input type='text' name='product_type' value={product_type} onChange={onChange} placeholder='Product Type'/>
            <textarea name='description' value={description} onChange={onChange} placeholder='Description'/>
            <button type='submit'>Create</button>
            </form>
        </div>
        <div className='tableWrapper'>
            <div className='tableHeading'>
             <span>All Products</span>   
            <input type='text' onChange={(e)=>setSearch(e.target.value)} className='searchBox' placeholder='Search Here'/>
            </div>
            <table>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Original Price</th>
                <th>Sale Price</th>
                <th>Product Type</th>
                <th>Description</th>
                {tableData && tableData
                    .filter((val)=>{
                        if(search===''){
                            return val
                        }else if(val.product_name.toLowerCase().includes(search.toLowerCase())){
                            return val
                        }
                    })
                    .slice(page * count -count,page*count).map((dat,i)=>{
                        return (
                            <tr>
                                <td >{dat._id}</td>
                                <td >{dat.product_name}</td>
                                <td >{dat.original_price}</td>
                                <td >{dat.sale_price}</td>
                                <td >{dat.product_type}</td>
                                <td >{dat.description}</td>
                            </tr>
                        )
                    })
                }
            </table>
            {tableData.length && 
            <div className='counter'>
                <label>row per page</label>
                <select onChange={(e)=>setCount(e.target.value)} value={count}>
                    <option value='10'>10</option>
                    <option value='15'>15</option>
                    <option value='20'>20</option>
                    <option value='25'>25</option>
                    <option value='30'>30</option>
                </select>
                
               <p>{page*count-count+1}-{page *count} of {tableData.length} </p> 
                
                <span onClick={()=>setPageFunc(page-1)}>Prev</span>
                {/* {[...Array(Math.floor(tableData.length/10))].map((_,i)=>{
                    return <span onClick={()=>setPageFunc(i+1)}>{i+1}</span>
                })} */}
                <span onClick={()=>setPageFunc(page+1)} >Next</span>
            </div>}
        </div>
    </div>
  )
}

export default Home