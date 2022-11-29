import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../../data/firebase';
import classes from './Options.module.css';
import { getDoc, doc, updateDoc } from "firebase/firestore";

const Options = () => {

    const { user } = useAuthContext();

    // States
    const [loading, setLoading] = useState(false);
    const [serviceId, setServiceId] = useState('');
    const [error, setError] = useState('');
    const [products, setProducts] = useState([{
        name: '',
        price: '',
        quantity: '',
        totalPrice: ''
    }])

    const handleNameChanger = (idx, e) => {
        let data = [...products];
        data[idx].name = e.target.value;
        setProducts(data)
    }

    const handlePriceChanger = (idx, e) => {
        let data = [...products];
        data[idx].price = e.target.value;
        data[idx].totalPrice = parseInt(e.target.value) * parseInt(products[idx].quantity)
        setProducts(data)
    }

    const handleQuantityChanger = (idx, e) => {
        let data = [...products];
        data[idx].quantity = e.target.value;
        data[idx].totalPrice = parseInt(e.target.value) * parseInt(products[idx].price);
        setProducts(data)
    }

    const addHandler = () => {
        setProducts([...products, {
            name: '',
            price: '',
            quantity: '',
            totalPrice: ''
        }])
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log(products)
        const date = new Date()
        const splitText = date.toLocaleDateString().split('/');
        const dateTemp = `${splitText[0]}${splitText[1]}${splitText[2]}`;
        const result = `${splitText[0]}${splitText[1]}${splitText[2]}services`
        // const result = '08112022services'
        // Getting the Data of the Service and then append it
        console.log(result, serviceId)
        const docRef = doc(db, result, serviceId);
        const response = await getDoc(docRef)

        if (response.exists()) {
            console.log(response.data());

            let data = response.data().spareParts;

            data = [...data, ...products]

            await updateDoc(doc(db, result, serviceId), {
                spareParts: data
            })

            alert('Added Successfully');
            setProducts([{
                name: '',
                price: '',
                quantity: '',
                totalPrice: ''
            }])
            setLoading(false);
        }
        else {
            console.log(response)
            console.log('Operation Failed')
            setError('Operation Failed');
            setLoading(false)
            return;
        }

    }

    return (
        <div className={classes.info}>
            <div className={classes.details}>
                <h2>Bill</h2>
                <form classes={classes.detail} onSubmit={submitHandler}>
                    <div className={classes.item}>
                        <h4>Service Id</h4>
                        <input required type="text" value={serviceId} onChange={e => setServiceId(e.target.value.trim())} />
                    </div>
                    <h4 style={{ marginBottom: '20px' }}>Products</h4>
                    {products && products.map((product, idx) => {
                        return (
                            <div className={classes.item_group}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div className={classes.item}>
                                        <h4>Name</h4>
                                        <input required type="text" value={product.name} onChange={e => handleNameChanger(idx, e)} />
                                    </div>
                                    <div className={classes.item}>
                                        <h4>Quantity</h4>
                                        <input required type="text" value={product.quantity} onChange={e => handleQuantityChanger(idx, e)} />
                                    </div>

                                    <div className={classes.item}>
                                        <h4>Price</h4>
                                        <input required type="text" value={product.price} onChange={e => handlePriceChanger(idx, e)} />
                                    </div>
                                    <div className={classes.item}>
                                        <h4>Total</h4>
                                        <input required type="text" value={product.totalPrice} onChange={e => console.log(e.target.value)} />
                                    </div>
                                    <div className={classes.item}>
                                        <h4>Add</h4>
                                        <img style={{ width: '2rem' }} onClick={addHandler} src="/spareparts/add.svg" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div className={classes.btns}>
                        {!loading && <button type="submit">Add to the Bill</button>}
                        {loading && <h4>Loading...</h4>}
                        {error && <h4 style={{ marginTop: '20px', textAlign: 'center' }}>{error}</h4>}
                    </div>
                </form>
                {/* <div className={classes.btns}>
                    {!loading && <button onClick={addHandler}>Add</button>}
                </div> */}
            </div>
        </div>
    );
}

export default Options;