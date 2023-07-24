import React,{ useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
 
function EventShow() {
    const [id, setId] = useState(useParams().id)
    const [longDescription, setLongDescription] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()

	useEffect(() => {
        fetchEventDetails()
    }, [])

    const fetchEventDetails = () => {
        setIsFetched(false)
        showLoader()
        axios.get(`/api/events_fo/show/${id}`)
        .then(function (response) {
            setIsFetched(true)
            setLongDescription(response.data.long_description)
            hideLoader()
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
    }

    return (
        <LayoutFo>
            {!isFetched ? <div className="text-center text-sm p-0 pb-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    <div className="row mb-2">
                        <div className="col-12 mb-4">
                            <div className="card border-radius-0 border-none shadow">
                                <div className="card-body pre">
                                    {parse(longDescription)}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </LayoutFo>
    );
}
  
export default EventShow;