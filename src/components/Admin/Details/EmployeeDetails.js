import React from 'react';
import classes from './EmployeeDetails.module.css';
import AdminFooter from './Footer';

const EmployeeDetails = () => {
    return (
        <>
            <div className={classes.addemployee}>
                <div className={classes.addemployee_first}>
                    <div className={classes.heading}>
                        <h3>Anuj Kumar</h3>
                        <p>Important Asset</p>
                    </div>
                    <div className={classes.btn}>
                        <button>Log out</button>
                    </div>
                </div>
                <div className={classes.main_logo}>
                    <h2>Mechanic Details</h2>
                    <form>
                        <div className={classes.single_field}>
                            <label>Name</label>
                            <input type="text" name="name" required value="Anuj Kumar" />
                        </div>
                        <div className={classes.single_field}>
                            <label>Email</label>
                            <input type="email" name="email" required value="anujkumar@gmail.com" />
                        </div>
                        <div className={classes.single_field}>
                            <label>Age</label>
                            <input type="number" name="age" required value="24" />
                        </div>
                        <div className={classes.single_field}>
                            <label>Profile Pic</label>
                            <input type="text" name="pic" required />
                        </div>
                        <div className={classes.single_field}>
                            <label>Phone No</label>
                            <input type="text" name="phone" required value="6376224569" />
                        </div>
                        <div className={classes.single_field}>
                            <label>Address</label>
                            <input type="text" name="address" required value="Muzaffarnagar" />
                        </div>
                        <div className={classes.btns}>
                            <button type='submit'>Edit Employee</button>
                            <button type='submit'>Delete Employee</button>
                        </div>
                    </form>
                </div>
            </div>
            <AdminFooter />
        </>
    );
}

export default EmployeeDetails;