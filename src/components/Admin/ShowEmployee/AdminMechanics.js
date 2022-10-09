import React from 'react';
import classes from './AdminMechanics.module.css';
import AdminFooter from './Footer';

const AdminMechanics = () => {
    return (
        <div className={classes.mechanics}>
            <div className={classes.mechanics_first}>
                <div className={classes.heading}>
                    <h3>List of Mechanics</h3>
                    <p>Important Assets</p>
                </div>
                <div className={classes.btn}>
                    <button>Add Employee</button>
                    <button>Log out</button>
                </div>
            </div>
            <div className={classes.employees}>
                <div className={classes.employee}>
                    <img src="https://media-exp1.licdn.com/dms/image/C5603AQGpI8qAs13Bqw/profile-displayphoto-shrink_400_400/0/1606614908808?e=1669852800&v=beta&t=sE3hwivM0mgkzEorlfxsZs82SPPpKFHyoQAyB4kVghs" alt="Employee" />
                    <h3>Anuj Kumar</h3>
                    <p>anujkumar@gmail.com</p>
                </div>
                <div className={classes.employee}>
                    <img src="https://media-exp1.licdn.com/dms/image/C4E03AQHwDMcePkxyUw/profile-displayphoto-shrink_800_800/0/1598697109996?e=1669852800&v=beta&t=et65vs8OO1eqKzox47XPTe5WFSzGUA-OeEcY_O7N8Uw" alt="Employee" />
                    <h3>Harsh Sukhija</h3>
                    <p>harsh@gmail.com</p>
                </div>
                <div className={classes.employee}>
                    <img src="https://media-exp1.licdn.com/dms/image/C4D03AQH95hZUNtImRQ/profile-displayphoto-shrink_800_800/0/1662278960377?e=1669852800&v=beta&t=7DhuY1XEvzUrAt_ZStG_Gh592P_zkQy7shi56n7xaAk" alt=" Employee" />
                    <h3>Nipun Garg</h3>
                    <p>nipungarg@gmail.com</p>
                </div>
                <div className={classes.employee}>
                    <img src="https://media-exp1.licdn.com/dms/image/C5603AQFoAqfMkIFbBw/profile-displayphoto-shrink_800_800/0/1649576604545?e=1669852800&v=beta&t=wVAEoOgs59YQwOk0-Uxcb_3WgnK2vM47k9V3EwHXIKg" alt="Employee" />
                    <h3>Rajnesh Kumar</h3>
                    <p>rajneshkumar@gmail.com</p>
                </div>
                <div className={classes.employee}>
                    <img src="https://media-exp1.licdn.com/dms/image/C4D03AQFDOt0NL3Vc3g/profile-displayphoto-shrink_800_800/0/1660488647448?e=1669852800&v=beta&t=quysT6Rb0DiBhHyrQqLrKIid1ZPwbm3cRUvWPZ4_DyI" alt="Employee" />
                    <h3>Tushar Pasricha</h3>
                    <p>tusharpasrichaa@gmail.com</p>
                </div>
            </div>
            <AdminFooter />
        </div>
    );
}

export default AdminMechanics;