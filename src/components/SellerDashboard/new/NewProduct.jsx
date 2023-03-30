import React,  { useState, useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import {create} from 'ipfs-http-client';
import {resetProductEditId} from "../../../redux/reducers/editSlice";
import {Card, Form, Input, Button} from "../../index";
import {useGetProductQuery, useAddProductMutation, useUpdateProductMutation} from "../../../redux/services/apiSlice";
import {toast} from 'react-toastify';
import HOC from "../../HOC";
import upload from "../../../upload";
import axios from "axios";


const client = create('https://ipfs.infura.io:5001');
const NewProduct = ({handleAdminPage}) => {
  const [product, setProduct] = useState({name: '', price: '', description: '',
                                    mediaUrl: '', quantity: '', supplier: '',
                                    details: {
                                      totalReviews: '',
                                      rating: '',
                                      availabilityStatus: '',
                                      productCode: '',
                                      productCategory: '',
                                      image1: '',
                                      image2: '',
                                      image3: '',
                                      image4: ''
                                    }
                                });

  const id = useSelector((state) => state.edit.productEditId);
  const {data} = useGetProductQuery(id);
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [file, setFile] = useState(null);
  

   const dispatch = useDispatch();
 
    useEffect(() => {
      if(data) setProduct(data)
    }, [id, data]);

    const handleChange =(e) => {
      setProduct((prev ) =>{
        return {...prev, [e.target.name] : e.target.value}
      });
    }

   
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = await upload(file); 
    try {
      await axios.post("http://localhost:5000/api/products", {mediaUrl: url})
    } catch (error) {
      
    }
    
    if(id !== null ) {
      await updateProduct({id, mediaUrl: url, ...product});
      toast.success("Product Updated!");
    }
    else {
      await addProduct({mediaUrl: url, ...product});
      toast.success("New Product Added!");
    }
   console.log(url) 
    clear();
    handleAdminPage("productList");

  }

  

const clear = () => {
  setProduct({name: '', price: '', 
  description: '', quantity: '', mediaUrl: '',
  supplier: '', details: {
      totalReviews: '',
      rating: '',
      availabilityStatus: '',
      productCode: '',
      productCategory: '',
      image1: '',
      image2: '',
      image3: '',
      image4: ''
  }});
  dispatch(resetProductEditId());
}

  return (
  
      <>
        <Card style={{justifyContent: 'center'}}>
          <h1 style={{color: 'lightgray', fontSize: '20px'}}>{(id === null) ? 'Add New Product' : 'Update Product'}</h1>
        </Card>
        <Card>
            <Form>
            <Input label="Name" type="text" name="name" value={product.name} handlechange={handleChange} />
            <Input label="Price" type="text" name="price" value={product.price} handlechange={handleChange} />
            <Input label="Description" type="text" name="description" value={product.description} handlechange={handleChange} />
            <Input label="Quantity" type="text" name="quantity" value={product.quantity} handlechange={handleChange} />
            <Input label="Supplier" type="text" name="supplier" value={product.supplier} handlechange={handleChange} />
            <Input label="Image" type="file"  onChange={(e) => setFile(e.target.files[0])} />
           
            </Form>
        </Card>
        <Button onClick={handleSubmit} >{(id === null) ? 'Add' : 'Update'}</Button>
      </>
  );
};
export default HOC(NewProduct);