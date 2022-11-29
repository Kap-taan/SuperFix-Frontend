// import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { db } from '../../../data/firebase';
// import NavbarM from './Navbar'
// import Welcome from '../../client/Dashboard/Welcome';
// import classes from './Manager.module.css';
// import WorkM from "./Work";
// import ManagerDashboard from "./Main";

// const Manager = () => {

//     const [loading, setLoading] = useState(true);
//     const [services, setServices] = useState([]);

//     const [work, setWork] = useState(false);

//     const getInfo = async (collectionName) => {


//         const docsSnap = await getDocs(collection(db, `${collectionName}services`));
//         let servicesTemp = [];
//         docsSnap.forEach(doc => {
//             if (doc.data().entry === true) {
//                 servicesTemp = [...servicesTemp, {
//                     carNo: doc.data().carNo,
//                     time: doc.data().time,
//                     entry: doc.data().entry,
//                     id: doc.id
//                 }]
//             }

//         })

//         setServices(servicesTemp);

//         console.log(servicesTemp);


//         setLoading(false);

//     }

//     useEffect(() => {
//         const collectionName = `${new Date().toLocaleDateString().substring(0, 2)}${new Date().toLocaleDateString().substring(3, 5)}${new Date().toLocaleDateString().substring(6, 10)}`;
//         // const collectionName = '17102022';
//         getInfo(collectionName);
//     }, [])


//     return (
//         <div className={classes.dashboard}>
//             <NavbarM />
//             <div className={classes.infos}>
//                 <div className={classes.quote}>
//                     <h3>Dashboard</h3>
//                 </div>
//                 <div className={classes.info}>
//                     <ManagerDashboard />
//                     <Welcome />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Manager;

// {/* <div className={classes.services}>
//                         {loading && <div className={classes.loading}>Loading...</div>}
//                         {!loading && services.length > 0 && <table className={classes.contentTable}>
//                             <thead>
//                                 <tr>
//                                     <th>Car No.</th>
//                                     <th>Slot</th>
//                                     <th>Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {services.map(service => (
//                                     <tr key={service.id}>
//                                         <td>{service.carNo}</td>
//                                         <td>{service.time}</td>
//                                         <td></td>
//                                     </tr>
//                                 ))}
//                             </tbody>

//                         </table>}
//                         {!loading && !services.length && <div className={classes.noService}><h5>No more Services registered for this day</h5></div>}
//                     </div> */}