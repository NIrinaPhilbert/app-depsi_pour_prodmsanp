import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import LayoutFo from "../../../components/LayoutFo"
import Swal from 'sweetalert2'
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import parse from 'html-react-parser'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

let document_access_keys = process.env.DOCUMENT_ACCESS_KEYS
document_access_keys = document_access_keys.split('|')
let document_access_values = process.env.DOCUMENT_ACCESS_VALUES
document_access_values = document_access_values.split('|')
const accesses = document_access_keys.reduce((arr, key, index) => {
    arr[key] = document_access_values[index]
    return arr
}, {})

function DocumentaryShow() {
    const id = useParams().id
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [date, setDate] = useState('')
    const [author, setAuthor] = useState('')
    const [pubtype, setPubtype] = useState('')
    const [direction, setDirection] = useState('')
    const [directionOptions, setDirectionOptions] = useState([])
    const [entitys, setEntitys] = useState('')
    const [entitysOptions, setEntitysOptions] = useState([])
    const [thematic, setThematic] = useState('')
    const [documentAccess, setDocumentAccess] = useState('')
    const [documentAccessOptions, setDocumentAccessOptions] = useState([])
    const [coverName, setCoverName] = useState('')
    const [coverFile, setCoverFile] = useState({})
    const [docIcons, setDocIcons] = useState([])
    const [docNames, setDocNames] = useState([])
    const [docFiles, setDocFiles] = useState([])
    const [docSizes, setDocSizes] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()
    let mysession = (localStorage.getItem('mysession') !== null) ? JSON.parse(localStorage.getItem('mysession')) : null
    const [isConnected, setIsConnected] = useState((mysession !== null && mysession.access != "none") ? true : false)

    useEffect(() => {
        showLoader()
        goToTop(document.querySelector('#hero').getBoundingClientRect().height - document.querySelector('#header').getBoundingClientRect().height + 65, 0)
        axios.get(`/api/docs_fo/${id}`)
        .then(function (response) {
            let doc = response.data
            setTitle(doc.title)
            setSummary(doc.summary)
            setDate(doc.date)
            setAuthor(doc.author)
            setDirection(doc.direction)
            setDirectionOptions(doc.directionOptions)
            setPubtype(doc.pub_type)
            setEntitys(doc.entities)
            setThematic(doc.thematic)
            setDocumentAccess(doc.documentAccess)
            setDocumentAccessOptions(doc.documentAccessOptions)
            setDocIcons(doc.docIcons)
            setDocNames(doc.docNames)
            setDocFiles(doc.docFiles)
            setDocSizes(doc.docSizes)
            setCoverName(doc.coverName)
            setCoverFile(doc.coverFile)
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
            navigate("/documentaryresources")
        })
    }, [id])

    const handleForceLogin = () => {
        Swal.fire({
            title: 'Cette ressource est privée.',
            text: "Seuls les membres peuvent la télécharger, donc il faut se connecter pour l'avoir.",
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: 'btn btn-md btn-outline-primary',
                cancelButton: 'btn btn-md btn-outline-secondary ms-2'
            },
            buttonsStyling: false,
            confirmButtonText: 'Se connecter',
            cancelButtonText: 'Annuler',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed) {
                showLoader()
                window.location.href = "/login"
            }
          })
    }

    const changeDirection = (selectedOptions) => {
        let directionSelected = selectedOptions.selectedKey
        setDirection(directionSelected)
        if (directionSelected != '') {
            showLoader()
            axios.get(`/api/entitys/entitiesOptions/${directionSelected}`)
            .then(function (response) {
                setEntitysOptions(response.data)
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
                navigate("/admin/documentaryresources")
            })
        }
    }

    const changeEntitys = (selectedOptions) => {
        setEntitys(selectedOptions.selectedKey)
    }
  
    return (
        <LayoutFo>
            {!isFetched ? <div className="text-center text-sm p-0 mb-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    <div className="card shadow border-none border-radius-0">
                        <div className="card-header bg-white p-3">
                            <h4 className="w-100 mb-0">Détails d'une ressource</h4>
                        </div>
                        <div className="card-body p-3">
                            <div className="w-100 my-4">
                                <div className='row'>
                                    <div className="col-sm-6 col-md-6">
                                        {coverName != '' &&
                                            <div className="mx-4 mb-3">
                                                <label className="w-100 mb-2" htmlFor="cover-img">Photo de couverture</label>
                                                <img id="cover-img" src={coverFile} className="img-thumbnail w-100 mb-2" />
                                            </div>
                                        }
                                    </div>
                                    <div className='col-sm-6 col-md-6'>
                                        <label className="w-100 mb-2">Informations du document</label>
                                        {/*
                                        <div className="form-floating mb-3">
                                            <input 
                                                value={accesses[documentAccess]}
                                                type="text"
                                                className="form-control border-radius-0 border-outline-primary bg-white"
                                                id="document_access"
                                                name="document_access"
                                                placeholder="Type d'accès"
                                                disabled={true}/>
                                            <label htmlFor="document_access">Type d'accès</label>
                                        </div>
                                        */}
                                        <div className="form-floating mb-3">
                                            <input 
                                                onChange={(event)=>{setTitle(event.target.value)}}
                                                value={title}
                                                type="text"
                                                className="form-control border-radius-0 border-outline-primary bg-white"
                                                id="title"
                                                name="title"
                                                placeholder="Titre"
                                                disabled={true}/>
                                            <label htmlFor="title">Titre</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input
                                                className="form-control border-radius-0 border-outline-primary bg-white"
                                                value={date}
                                                onChange={(value)=>{setDate(value)}}
                                                id="date"
                                                name="date"
                                                placeholder="Date de publication"
                                                disabled={true}
                                            />
                                            <label htmlFor="date">Date de publication</label>
                                        </div>
                                        
                                        <div className="form-floating mb-3">
                                            <input 
                                                onChange={(event)=>{setPubtype(event.target.value)}}
                                                value={pubtype}
                                                type="text"
                                                className="form-control border-radius-0 border-outline-primary bg-white"
                                                id="pubtype"
                                                name="pubtype"
                                                placeholder="Type de publication"
                                                disabled={true}/>
                                            <label htmlFor="pubtype">Type de publication </label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input 
                                                onChange={(event)=>{setThematic(event.target.value)}}
                                                value={thematic}
                                                type="text"
                                                className="form-control border-radius-0 border-outline-primary bg-white"
                                                id="thematic"
                                                name="thematic"
                                                placeholder="Thématique"
                                                disabled={true}/>
                                            <label htmlFor="thematic">Thématique</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input 
                                                onChange={(event)=>{setDirection(event.target.value)}}
                                                value={direction}
                                                type="text"
                                                className="form-control border-radius-0 border-outline-primary bg-white"
                                                id="direction"
                                                name="direction"
                                                placeholder="Direction"
                                                disabled={true}/>
                                            <label htmlFor="direction">Direction</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input 
                                                onChange={(event)=>{setEntitys(event.target.value)}}
                                                value={entitys}
                                                type="text"
                                                className="form-control border-radius-0 border-outline-primary bg-white"
                                                id="entitys"
                                                name="entitys"
                                                placeholder="Entité source"
                                                disabled={true}/>
                                            <label htmlFor="entitys">Entité source</label>
                                        </div>
                                    </div>
                                    

                                </div>
                                <div className="rrow mx-4 px-2 mb-4 py-2 card">
                                    {parse(summary)}
                                </div>
                                {docNames != '' &&
                                    <>
                                        {(documentAccess == document_access_keys[0] || isConnected)
                                            ? <>
                                                <div className="row mx-4 mb-4">
                                                    {/*<label className="form-label" htmlFor="doc">Document</label>*/}
                                                    {docFiles.map((dfile, keyfiler)=>{
                                                        return (
                                                            <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6 mt-4" key={keyfiler}>
                                                                <div className="card">
                                                                    <div className="text-center mt-3">
                                                                        <img src={docIcons[keyfiler]} style={{"width": "75px"}} className="card-img-top" alt="icon" />
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <h6 className="card-title document-title">{docNames[keyfiler]}</h6>
                                                                        <label className="text-muted text-end w-100 mt-2">{docSizes[keyfiler]}</label>
                                                                        <p className="card-text text-center mt-3">
                                                                            <a
                                                                                href={docFiles[keyfiler]}
                                                                                target="blank"
                                                                                className="btn btn-sm btn-outline-primary border-radius-0">
                                                                                <i className="bi bi-download me-1"></i>
                                                                                Télécharger
                                                                            </a>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                            : <>
                                                <div className="row mx-4 mb-4">
                                                    <label className="form-label" htmlFor="doc">Document</label>
                                                    {docFiles.map((dfile, keyfile)=>{
                                                        return (
                                                            <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6 mt-4" key={keyfile}>
                                                                <div className="card">
                                                                    <div className="text-center mt-3">
                                                                        <img src={docIcons[keyfile]} style={{"width": "75px"}} className="card-img-top" alt="icon" />
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <h6 className="card-title document-title">{docNames[keyfile]}</h6>
                                                                        <p className="card-text text-center mt-3">
                                                                            <a
                                                                                onClick={(e)=>{e.preventDefault(); handleForceLogin()}}
                                                                                className="btn btn-sm btn-outline-primary border-radius-0">
                                                                                <i className="bi bi-download me-1"></i>
                                                                                Télécharger
                                                                            </a>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        }
                                    </>
                                }
                                
                                
                            </div>
                        </div>
                        <div className="card-footer bg-white text-center p-3">
                            <Link
                                to={`/documentaryresources/`}
                                className="btn btn btn-sm btn-outline-secondary border-radius-0">
                                <i className="bi bi-arrow-left me-1"></i>
                                Retour liste
                            </Link>
                        </div>
                    </div>
                </>
            }
        </LayoutFo>
    );
}
  
export default DocumentaryShow;