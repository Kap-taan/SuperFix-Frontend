import React from 'react';
import classes from './AdminDashboard.module.css';

const AdminDashboard = () => {
    return (
        <div className={classes.dashboard}>
            <div className={classes.dashboard_first}>
                <div className={classes.heading}>
                    <h3>Admin Portal</h3>
                    <p>Hello Anuj Kumar</p>
                </div>
                <div className={classes.boxes}>
                    <div className={`${classes.box} ${classes.boxcolor1}`}>
                        <div className={classes.box1}>
                            <img src="/admin/mechanic.svg" alt="BoxIMG" />
                            <p>@important component</p>
                        </div>
                        <div className={classes.box2}>
                            <h2>Mechanics</h2>
                        </div>
                        <div className={classes.box3}>
                            <p>#assets</p>
                        </div>
                    </div>
                    <div className={`${classes.box} ${classes.boxcolor2}`}>
                        <div className={classes.box1}>
                            <img src="/admin/accountant.svg" alt="BoxIMG" />
                            <p>@maths</p>
                        </div>
                        <div className={classes.box2}>
                            <h2>Accountants</h2>
                        </div>
                        <div className={classes.box3}>
                            <p>#important</p>
                        </div>
                    </div>
                    <div className={`${classes.box} ${classes.boxcolor3}`}>
                        <div className={classes.box1}>
                            <img src="/admin/mechanic.svg" alt="BoxIMG" />
                            <p>@services</p>
                        </div>
                        <div className={classes.box2}>
                            <h2>Service Agents</h2>
                        </div>
                        <div className={classes.box3}>
                            <p>#services</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.dashboard_second}>
                {/* <div className={classes.headingg}>
                    <h3>Overview - Today</h3>
                </div> */}
                <div className={classes.boxess}>
                    <div className={`${classes.boxx} ${classes.boxcolor1}`}>
                        <p>@gatekeeper</p>
                        <h2>Guards</h2>
                    </div>
                    <div className={`${classes.boxx} ${classes.boxcolor2}`}>
                        <p>@spareparts</p>
                        <h2>Store Managers</h2>
                    </div>
                    <div className={`${classes.boxx} ${classes.boxcolor3}`}>
                        <p>@todayservices</p>
                        <h2>30</h2>
                    </div>
                    <div className={`${classes.boxx} ${classes.boxcolor4}`}>
                        <p>@exit</p>
                        <h2>Logout</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;