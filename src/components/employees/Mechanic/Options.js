import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../../data/firebase';
import emailjs from 'emailjs-com'
import classes from './Options.module.css';
import { storage } from "../../../data/firebase";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import LiveStream from "../../Livestream/LiveStream";
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";

const Options = () => {

    const { user } = useAuthContext();

    // States
    const [service, setService] = useState({});
    const [shouldStart, setShouldStart] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [currStage, setCurrStage] = useState('starting');
    const [isStartedLiveStream, setIsStartedLiveStream] = useState(false);

    // Coll States
    const [collName, setCollName] = useState('');

    // Product States
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    // Loading state
    const [loading, setLoading] = useState(false);

    const sendEmail = (email, message, subject) => {
        emailjs.send('service_sar8k95', 'template_juinmew', { email, message, subject }, 'gOg_hi3ORrq1QmKIr').then(result => {
            console.log(result.text);
        }).catch(err => console.log(err))
    }

    const allotingService = async (dateTemp) => {
        // Getting the info of current service available to the Mechanic
        setLoading(true);
        const q = query(collection(db, `${dateTemp}services`), where("mechanicId", "==", user.firebaseId))

        const response = await getDocs(q)

        let tempService = []
        response.forEach(doc => {
            if (!doc.data().complete) {
                tempService = [...tempService, {
                    ...doc.data(),
                    id: doc.id
                }]
            }
        })

        if (tempService.length > 0) {
            setShouldStart(true);
            tempService = tempService[0]
            setService(tempService);
            setLoading(false);
        } else {
            console.log('I m here')
            // No service is yet allocated automatically
            // Now we have to check the high priority queue
            console.log(`${dateTemp}highpriority`)
            const response = await getDocs(collection(db, `${dateTemp}highpriority`))
            let tempHigh = []
            response.forEach(doc => {
                tempHigh = [...tempHigh, {
                    ...doc.data(),
                    id: doc.id
                }]
            })
            console.log(tempHigh);
            let availableServices = tempHigh.filter(high => !high.isScheduled)
            if (availableServices.length > 0) {
                // Some service require a mechanic
                availableServices.sort((a, b) => a.created_at.seconds - b.created_at.seconds)
                console.log(availableServices[0]);
                console.log(availableServices[0].id);
                // Update the isScheduled to true
                await updateDoc(doc(db, `${dateTemp}highpriority`, availableServices[0].id), {
                    isScheduled: true
                })
                // // Update the service document
                await updateDoc(doc(db, `${dateTemp}services`, availableServices[0].serviceId), {
                    mechanicId: user.firebaseId
                })
                // Get the service info
                const response = await getDoc(doc(db, `${dateTemp}services`, availableServices[0].serviceId))
                console.log(availableServices[0])
                console.log(response.data());
                setService({
                    ...response.data(),
                    id: response.id
                })
                setShouldStart(true);
                setLoading(false);
            } else {
                console.log('I m in priority')
                console.log(`${dateTemp}priority`)
                const response = await getDocs(collection(db, `${dateTemp}priority`))
                let tempLow = []
                response.forEach(doc => {
                    tempLow = [...tempLow, {
                        ...doc.data(),
                        id: doc.id
                    }]
                })
                console.log(tempLow);
                let availableServices1 = tempLow.filter(high => !high.isScheduled)
                if (availableServices1.length > 0) {
                    // Some service require a mechanic
                    availableServices1.sort((a, b) => a.created_at.seconds - b.created_at.seconds)
                    console.log(availableServices1[0]);
                    // Update the isScheduled to true
                    await updateDoc(doc(db, `${dateTemp}priority`, availableServices1[0].id), {
                        isScheduled: true
                    })
                    // Update the service document
                    await updateDoc(doc(db, `${dateTemp}services`, availableServices1[0].serviceId), {
                        mechanicId: user.firebaseId
                    })
                    // Get the service info
                    const response = await getDoc(doc(db, `${dateTemp}services`, availableServices1[0].serviceId))
                    console.log(availableServices1[0])
                    console.log(response.data())
                    // const tempService = {...response.data(), }
                    setService({
                        ...response.data(),
                        id: response.id
                    })

                    setShouldStart(true);
                    setLoading(false);
                } else {
                    await updateDoc(doc(db, 'mechanic', user.firebaseId), {
                        available: true
                    })
                    setLoading(false);
                }
            }
        }
    }

    useEffect(() => {

        if (user) {
            console.log(user);

            if (localStorage.getItem('mechanic')) {
                setService(JSON.parse(localStorage.getItem('mechanic')))
                setIsStarted(true);
                setIsStartedLiveStream(true);
                setShouldStart(true);
                // Getting the Collection Name
                const date = new Date()
                const splitText = date.toLocaleDateString().split('/');
                const dateTemp = `${splitText[0]}${splitText[1]}${splitText[2]}`;
                const result = `${splitText[0]}${splitText[1]}${splitText[2]}services`
                // const result = '08112022services'

                // setCollName(result);
                setCollName(dateTemp)
                return;
            }

            // Getting the Collection Name
            const date = new Date()
            const splitText = date.toLocaleDateString().split('/');
            const dateTemp = `${splitText[0]}${splitText[1]}${splitText[2]}`;

            // setCollName(result);
            setCollName(dateTemp)

            allotingService(dateTemp);
        }

    }, [user])

    const startHandler = async () => {
        setLoading(true);
        // Update the isStarted to true in service document
        await updateDoc(doc(db, `${collName}services`, service.id), {
            isStarted: true,
            status: 'Service is started'
        })
        let message = 'Your service is started and will inform you as soon as the service is completed'
        let subject = 'Your service is started'
        sendEmail(service.email, message, subject);
        setService({
            ...service,
            isStarted: true
        })
        // Start the Live Stream
        localStorage.setItem('mechanic', JSON.stringify(service));
        setIsStartedLiveStream(true);
        setIsStarted(true);
        setLoading(false);
    }

    const stopHandler = async () => {
        setLoading(true);
        const answer = prompt('Do you want to stop the service(y/n) : ');
        if (answer !== 'y') {
            return;
        }
        console.log(service);
        await updateDoc(doc(db, `${collName}services`, service.id), {
            complete: true,
            status: "Meet the Accountant",
            isStarted: false
        })
        const response = await getDocs(query(collection(db, service.userId), where('serviceId', '==', service.id)));
        let tempId = []
        response.forEach(doc => {
            tempId = [...tempId, doc.id];
        })
        console.log(tempId[0]);
        await updateDoc(doc(db, service.userId, tempId[0]), {
            isDone: true
        })
        localStorage.removeItem('mechanic');

        let message = 'Your service is completed and now you have to meet the accountant'
        let subject = 'Your service is completed'
        sendEmail(service.email, message, subject);
        setIsStartedLiveStream(false);
        setShouldStart(false);
        setIsStarted(false);
        setService({});
        alert('Completed Successfully')
        setLoading(false);
        window.location.reload(false);
    }

    const infoHandler = () => {
        setCurrStage('info')
    }

    const backHandler = () => {
        setCurrStage('starting')
    }

    const addProductHandler = () => {
        setCurrStage('addProduct')
    }

    const productHandler = (e) => {
        e.preventDefault();
        setImageUploading(true);

        console.log(service);

        if (imageUpload === null) {
            return;
        }

        // Making the Image ref
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`)
        uploadBytes(imageRef, imageUpload).then((response) => {
            return getDownloadURL(response.ref)
        }).then(url => {
            updateDoc(doc(db, `${collName}services`, service.id), {
                mechanicProducts: [...service.mechanicProducts, {
                    name: product,
                    quantity: parseInt(quantity),
                    url: url
                }]
            }).then(() => {
                setService({
                    ...service,
                    mechanicProducts: [...service.mechanicProducts, {
                        name: product,
                        quantity: parseInt(quantity),
                        url: url
                    }]
                })
                localStorage.removeItem('mechanic');
                localStorage.setItem('mechanic', JSON.stringify(service));
                // Showing the Success Message
                alert('Image Uploaded')
                // Making the initial Values
                setImageUploading(false);
                setImageUpload(null);
                setProduct('')
                setQuantity('')
            })
        })

    }

    return (
        <>
            {currStage === 'starting' && <div className={classes.options}>
                <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.1s' }}>
                    <div className={classes.option_img}>
                        <img src="/client/car.svg" alt="Vehicle" />
                    </div>
                    <div className={classes.option_content}>
                        <h5>{service.carNo}</h5>
                        {!loading && !shouldStart && !isStarted && <h5>Not Scheduled</h5>}
                        {loading && <h5>Loading...</h5>}
                    </div>
                </motion.div>
                <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.2s' }}>
                    <div className={classes.option_img}>
                        {shouldStart && !isStarted && <img src="/mechanic/start.svg" alt="Book" />}
                        {isStarted && <img src="/mechanic/stop.svg" alt="Book" />}
                        {!shouldStart && !isStarted && <img src="/mechanic/noservice.svg" alt="Book" />}
                    </div>
                    <div className={classes.option_content}>
                        {!loading && service.id && shouldStart && !isStarted && <h5 onClick={startHandler}>Start the Service</h5>}
                        {!loading && !service.id && <h5>Not Scheduled</h5>}
                        {isStartedLiveStream && <LiveStream type="mechanic" id={service.id} />}
                        {/* {isStartedLiveStream && <LiveStream type="host" id="abc" />} */}
                        {loading && <h5>Loading...</h5>}
                        {!loading && isStarted && <h5 onClick={stopHandler}>Stop the Service</h5>}
                        {!shouldStart && !isStarted && service.id && <h5>Not Scheduled</h5>}
                    </div>
                </motion.div>
                <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.3s' }}>
                    <div className={classes.option_img}>
                        <img src="/mechanic/info.svg" alt="Book" />
                    </div>
                    <div className={classes.option_content}>
                        {!loading && service.id && shouldStart && <h5 onClick={infoHandler}>Info about the Service</h5>}
                        {!loading && !service.id && <h5>Not Scheduled</h5>}
                        {!loading && !shouldStart && !isStarted && service.id && <h5>Not Scheduled</h5>}
                        {loading && <h5>Loading...</h5>}
                    </div>
                </motion.div>
                <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.4s' }}>
                    <div className={classes.option_img}>
                        <img src="/mechanic/product.svg" alt="Book" />
                    </div>
                    <div className={classes.option_content}>
                        {!loading && service.id && shouldStart && <h5 onClick={addProductHandler}>Add Products</h5>}
                        {!loading && !service.id && <h5>Not Scheduled</h5>}
                        {!loading && !shouldStart && !isStarted && service.id && <h5>Not Scheduled</h5>}
                        {loading && <h5>Loading...</h5>}
                    </div>
                </motion.div>
            </div>}
            {currStage === 'info' && <div className={classes.info}>
                {/* <h2>Details</h2> */}
                <div className={classes.details}>
                    <div className={classes.detail}>
                        <h5>Service ID</h5>
                        <h3>{service.id}</h3>
                    </div>
                    <div className={classes.detail}>
                        <h5>Car No.</h5>
                        <h3>{service.carNo}</h3>
                    </div>
                    <div className={classes.detail}>
                        <h5>Company</h5>
                        <h3>{service.company}</h3>
                    </div>
                    <div className={classes.detail}>
                        <h5>Model</h5>
                        <h3>{service.model}</h3>
                    </div>
                    <div className={classes.detail}>
                        <h5>Variant</h5>
                        <h3>{service.variant}</h3>
                    </div>
                    <div className={classes.detail}>
                        <h5>Issues</h5>
                        {service.issues && service.issues.map(issue => (
                            <h3 key={issue}>{issue}</h3>
                        ))}
                    </div>
                    <div className={classes.detail}>
                        <h5>Options</h5>
                        {service.options.type && <h3>Type: {service.options.type.toUpperCase()}</h3>}
                        {service.options.washing && <h3>Washing: {service.options.washing.toUpperCase()}</h3>}
                        {service.options.polish && <h3>Polish: {service.options.polish.toUpperCase()}</h3>}
                        {service.options.dryClean && <h3>Dry Clean: {service.options.dryClean.toUpperCase()}</h3>}
                    </div>
                    <div className={classes.detail}>
                        <button onClick={backHandler}>GO Back</button>
                    </div>
                </div>
            </div>}
            {currStage === 'addProduct' && <div className={classes.info}>
                <div className={classes.details}>
                    <h2>Add Product</h2>
                    <form classes={classes.detail} onSubmit={productHandler}>
                        <div className={classes.item}>
                            <h4>Product</h4>
                            <input type="text" value={product} onChange={e => setProduct(e.target.value)} />
                        </div>
                        <div className={classes.item}>
                            <h4>Quantity</h4>
                            <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} />
                        </div>
                        <div className={classes.item}>
                            <h4>Add Image</h4>
                            <input type="file" onChange={e => setImageUpload(e.target.files[0])} />
                        </div>
                        <div className={classes.btns}>
                            {!imageUploading && <button type="submit">Add</button>}
                            {!imageUploading && <button onClick={backHandler}>Go Back</button>}
                            {imageUploading && <h5>Uploading...</h5>}
                        </div>
                    </form>
                </div>
            </div>}

            {/* <LiveStream type="host" id="abc" /> */}
        </>

    );
}

export default Options;