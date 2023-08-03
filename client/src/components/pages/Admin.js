import React, { Fragment, useState, useEffect, useContext } from "react";
import { useAuth } from "../../contexts/AuthContext"

export default function Admin() {

    // env vars starting with REACT_APP_ are injected into the build process
    const API_URL = process.env.REACT_APP_API_URL

    let isAdmin = false;

    const [shouldRender, setShouldRender] = useState(false);
    const { currentUser, logout } = useAuth()
    const checkAdmin = async e => {
    try {
        const idToken = localStorage.getItem('firebaseIdToken');
        const id =  currentUser.email;
        const response = await fetch(
            API_URL + `/instructors`, {   
                headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" }
            }
        );
        if (response.ok) {
            const jsonData = await response.json();
            console.log(jsonData.rows);

            // check to see if the current user is in the admin results
            const rows = jsonData.rows;
            for(e in rows) {
                rows[e].email === id ? isAdmin = true : isAdmin = false;
            }
            console.log(isAdmin);
            return jsonData;
        } else {
            if(response.status === 403){
                window.location = '/login';
            }
        }
    } catch (err) {
        console.error(err.message);
    }
  };

  useEffect(() => {
    console.log("using effect")
    checkAdmin();
  },[]);

    // Simulating a delay before rendering the component
    setTimeout(() => {
        setShouldRender(true);
    }, 500);

    return(
        <Fragment>
            <p>{isAdmin}</p>
            <p>Will do admin page stuff here.</p>
        </Fragment>
    )
}