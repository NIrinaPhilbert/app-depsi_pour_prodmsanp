import React,{ useState, useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
 
function DocumentaryToList() {
    const navigate = useNavigate()

	useEffect(() => {
        navigate("/documentaryresources")
    }, [])

    return true
}
  
export default DocumentaryToList;