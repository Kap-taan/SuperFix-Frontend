import React from 'react';
import { Link } from 'react-router-dom';
import { useEmployeeLogout } from "../../../hooks/useEmployeeLogout";
import classes from './AdminDashboard.module.css';

const AdminDashboard = () => {

    const { logout } = useEmployeeLogout();

    return (
        <div className={classes.dashboard}>
            <div className={classes.dashboard_first}>
                <div className={classes.heading}>
                    <h3>Admin Portal</h3>
                    <p>Hello Anuj Kumar</p>
                </div>
                <div className={classes.boxes}>
                    <Link to="/admin/addemployee">
                        <div className={`${classes.box} ${classes.boxcolor1}`}>
                            <div className={classes.box1}>
                                <img src="/admin/mechanic.svg" alt="BoxIMG" />
                                <p>@important component</p>
                            </div>
                            <div className={classes.box2}>
                                <h2>Add Employee</h2>
                            </div>
                            <div className={classes.box3}>
                                <p>#important</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/employees">
                        <div className={`${classes.box} ${classes.boxcolor2}`}>
                            <div className={classes.box1}>
                                <img src="/admin/accountant.svg" alt="BoxIMG" />
                                <p>@list</p>
                            </div>
                            <div className={classes.box2}>
                                <h2>Employees</h2>
                            </div>
                            <div className={classes.box3}>
                                <p>#important</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/status">
                        <div className={`${classes.box} ${classes.boxcolor3}`}>
                            <div className={classes.box1}>
                                <img src="/admin/mechanic.svg" alt="BoxIMG" />
                                <p>@services</p>
                            </div>
                            <div className={classes.box2}>
                                <h2>Today's Status</h2>
                            </div>
                            <div className={classes.box3}>
                                <p>#services</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className={classes.dashboard_second}>
                {/* <div className={classes.headingg}>
                    <h3>Overview - Today</h3>
                </div> */}

                <div className={classes.boxess}>
                    <Link to="/admin/cancel">
                        <div className={`${classes.boxx} ${classes.boxcolor1}`}>
                            <p>@Today's services</p>
                            <h2>Cancel</h2>
                        </div>
                    </Link>
                    <Link to="/admin/operationalunits">
                        <div className={`${classes.boxx} ${classes.boxcolor2}`}>
                            <p>@update</p>
                            <h2>Operational Units</h2>
                        </div>
                    </Link>
                    {/* <div className={`${classes.boxx} ${classes.boxcolor3}`}>
                        <p>@edit</p>
                        <h2>Time Slots</h2>
                    </div> */}
                    <div className={`${classes.boxx} ${classes.boxcolor4}`} onClick={() => logout()}>
                        <p>@exit</p>
                        <h2>Logout</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;