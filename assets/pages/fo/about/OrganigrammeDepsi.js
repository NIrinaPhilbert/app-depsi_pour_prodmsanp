import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

function OrganigrammeDepsi() {
    const [textContent, setTextContent] = useState('')
    const [isFetched, setIsFetched] = useState(false)

    useEffect(() => {
        showLoader()
        axios.get(`/api/organigrammedepsi_fo/data`)
        .then(function (response) {
            let aboutData = response.data
            setTextContent(aboutData.textContent)
            hideLoader()
            setIsFetched(true)
        })
        .catch(function (error) {
            toast.error('Une erreur est survenue.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            navigate("/")
        })
    }, [])
  
    return (
        <LayoutFo>
            {!isFetched ? <div className="text-center text-sm p-0 pb-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    <div className="card shadow border-none border-radius-0">
                        <div className="card-body pre">
                            {parse(textContent)}
                        </div>
                    </div>
                </>
            }
        </LayoutFo>
    );
}
  
export default OrganigrammeDepsi;