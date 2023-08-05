import React,{ useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
 
function EventShow() {
    const [id, setId] = useState(useParams().id)
    const [titreevenement, setTitreEvenement] = useState('')
    const [longDescription, setLongDescription] = useState('')
    const [courteDescription, setCourteDescription] = useState('')
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
            setTitreEvenement(response.data.titreevenement)
            setCourteDescription(response.data.courte_description)
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
                                    <div className="w-100 my-4">
                                    
                                        <div className="mx-4 mb-3">
                                            <div className="jumbotron">
                                                <h3>
                                                    {titreevenement}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="jumbotron mx-4 mb-3">
                                            <p className="border-radius-0 border-outline-primary bg-white w-100 h-auto pre">
                                                {parse(longDescription)}
                                            </p>
                                        </div>
                                       
                                        
                                    </div>
                                    
                                </div>
                                <div className="card-footer bg-white text-center p-3">
                                    <Link
                                        to={`/`}
                                        className="btn btn btn-sm btn-outline-secondary border-radius-0">
                                        <i className="bi bi-arrow-left me-1"></i>
                                        Retour accueil
                                    </Link>
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