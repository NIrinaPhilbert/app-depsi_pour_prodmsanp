import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

function VideothequeDetails() {
    const id = useParams().id
    const [title, setTitle] = useState('')
    const [video, setVideo] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        showLoader()
        axios.get(`/api/videotheques_fo/show/${id}`)
        .then(function (response) {
            let doc = response.data
            setTitle(doc.title)
            setVideo(doc.video)
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
    }, [id])
  
    return (
        <LayoutFo>
            {!isFetched ? <div className="text-center text-sm p-0 pb-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    <div className="card shadow border-none border-radius-0">

                        <div className="card-body p-3">
                            <div className="w-100 my-4">
                                
                                <div className="mx-4 mb-4">
                                    <div className="jumbotron">
                                        <h3 className="text-center">
                                            {title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="jumbotron mx-4 mb-3 mt-3">
                                    <p className="border-radius-0 border-outline-primary bg-white w-100 h-auto pre">
                                        <iframe
                                            className="w-100"
                                            src={video}
                                            frameBorder="0"
                                            allowFullScreen
                                            title={title}
                                            style={{minHeight: "500px"}}
                                        ></iframe>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </LayoutFo>
    );
}
  
export default VideothequeDetails;