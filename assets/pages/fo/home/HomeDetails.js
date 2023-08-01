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
                        <div className="card-header bg-white p-3">
                            <h4 className="w-100 mb-0">Détail de l'information</h4>
                        </div>
                        <div className="card-body p-3">
                            <div className="w-100 my-4">
                                {imageName != '' &&
                                    <div className="mx-4 mb-3">
                                        <label className="w-100 mb-2" htmlFor="cover-img">Photo de couverture <span className="text-bold text-danger text-sm">*</span></label>
                                        <img id="cover-img" src={imageFile} className="img-thumbnail w-50 mb-2" />
                                    </div>
                                }
                                <div className="form-floating mx-4 mb-3">
                                    <input 
                                        value={title}
                                        type="text"
                                        className="form-control border-radius-0 border-outline-primary bg-white"
                                        id="title"
                                        name="title"
                                        placeholder="Titre"
                                        disabled={true}/>
                                    <label htmlFor="title">Titre <span className="text-bold text-danger text-sm">*</span></label>
                                </div>
                                <div className="mx-4 mb-3">
                                    <label className="mb-2">Contenu</label>
                                    <p className="form-control border-radius-0 border-outline-primary bg-white w-100 h-auto pre">
                                        {parse(textContent)}
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
                </>
            }
        </LayoutFo>
    );
}
  
export default HomeDetails;