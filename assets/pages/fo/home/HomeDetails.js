import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

function HomeDetails() {
    const id = useParams().id
    const [title, setTitle] = useState('')
    const [imageName, setImageName] = useState('')
    const [imageFile, setImageFile] = useState({})
    const [textContent, setTextContent] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()
    let mysession = (localStorage.getItem('mysession') !== null) ? JSON.parse(localStorage.getItem('mysession')) : null
    const [isConnected, setIsConnected] = useState((mysession !== null && mysession.access != "none") ? true : false)

    useEffect(() => {
        showLoader()
        axios.get(`/api/home_fo/${id}`)
        .then(function (response) {
            let doc = response.data
            setTitle(doc.title)
            setImageName(doc.imageName)
            setImageFile(doc.imageFile)
            setTextContent(doc.textContent)
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
                                
                                <div className="mx-4 mb-3">
                                    <div class="jumbotron">
                                        <h3>
                                            {title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="jumbotron mx-4 mb-3">
                                    <p className="border-radius-0 border-outline-primary bg-white w-100 h-auto pre">
                                        {parse(textContent)}
                                    </p>
                                </div>
                                {imageName != '' &&
                                    <div className="mx-4 mb-3">
        
                                        <img id="cover-img" src={imageFile} className="img-thumbnail w-50 mb-2" />
                                    </div>
                                }
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
                </>
            }
        </LayoutFo>
    );
}
  
export default HomeDetails;