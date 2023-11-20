import React, {useState, useEffect, useRef} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const acceptCoverExtension = ".jpg,.jpeg,.png"
const acceptCoverFormat = [
    'image/jpeg',
    'image/png'
]

function VideothequeEdit() {
    const id = useParams().id
    const [title, setTitle] = useState('')
    const [coverName, setCoverName] = useState('')
    const [coverNameToEdit, setCoverNameToEdit] = useState('')
    const [coverFile, setCoverFile] = useState({})
    const [video, setVideo] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/videotheques/${id}`)
        .then(function (response) {
            let doc = response.data
            setTitle(doc.title)
            setVideo(doc.video)
            setCoverName(doc.coverName)
            setCoverNameToEdit(doc.coverName)
            setCoverFile(doc.coverFile)
            setIsSaving(false)
            hideLoader()
            setIsFetched(true)
        })
        .catch(function (error) {
            toast.error('Une erreur api docs est survenue.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            navigate("/admin/videotheques")
        })
    }, [id])
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            title == '' 
            || coverName == '' 
            || video == '' 
            || !isURL(video)
        ) {
            goToTop(0, 0)
            setIsGeneralError(true)
            if (coverName == '') {
                document.querySelector("#cover").value = ''
                setMsgGeneral("La photo de couverture est requise.")
            }
            else if (title == '') setMsgGeneral("Le champ \"Titre\" est requis.")
            else if (video == '') setMsgGeneral("Le champ \"Vidéo\" est requis.")
            else if (!isURL(video)) setMsgGeneral("Saisissez un URL vidéo valide.")
            else setMsgGeneral("Une erreur quelconque est survenue.")
            setIsSaving(false)
            hideLoader()
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            let formData = new FormData()
            formData.append("action", "modify")
            formData.append("coverFile", coverFile)
            formData.append("coverName", coverName)
            formData.append("coverNameToEdit", coverNameToEdit)
            formData.append("title", title)
            formData.append("video", video)
            axios.post(`/api/videotheques/edit/${id}`, formData)
                .then(function (response) {
                    console.log('response='+response)
                    hideLoader()
                    toast.success("Vidéothèque modifiée avec succès.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    })
                    setIsSaving(true)
                    navigate("/admin/videotheques")
                })
                .catch(function (error) {
                    toast.error('Une erreur modification est survenue.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setIsSaving(true)
                    navigate('/admin/videotheques')
                });
        }
    }

    const onCoverChange = (event) => {
        var thisFile = event.target.files[0]
        if (acceptCoverFormat.includes(thisFile.type) && thisFile) {
            setCoverFile(thisFile)
            setIsGeneralError(false)
            setMsgGeneral("")
            setCoverName(thisFile.name)
            const reader = new FileReader();
            reader.onloadend = () => {
                document.querySelector("#cover-img").setAttribute("src", reader.result);
            };
            reader.readAsDataURL(thisFile);
        } else {
            goToTop(0, 0)
            setCoverFile({})
            setIsGeneralError(true)
            setMsgGeneral("Type de fichier invalide. Choisissez entre : "+acceptCoverExtension)
            setCoverName("")
            document.querySelector("#cover").value = ''
            document.querySelector("#cover-img").setAttribute("src", coverName);
        }
    }

    const clearCover = () => {
        setCoverFile({})
        setCoverName('')
    }

    function isURL(str) {
        // Regular expression pattern for a valid URL
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // Protocol
        '((([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,})|' + // Domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4 address
        '(\\:\\d+)?(\\/[-a-zA-Z0-9_.]*)*(\\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+(&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)*)?$', 'i'); // Port and Query String

        return pattern.test(str);
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Vidéothèques</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/videotheques">Vidéothèques</Link></li>
                        <li className="breadcrumb-item active">Mise à jour</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-3">
                            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                                <div className="card-body p-3">
                                    <div className="mt-2 mb-4"><h4>Modifier une vidéothèque</h4></div>
                                    <hr className="mt-2 mb-4"/>
                                    {!isFetched ? <div className="text-center text-sm p-0 pb-3"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                                        :
                                        <>
                                            <div className="w-100 mb-4">
                                                {isGeneralError &&
                                                    <div className="mx-4 mt-3 mb-3 alert alert-warning text-center form-error">
                                                        <i className="fa fa-exclamation-triangle fa-fw mx-1"></i>
                                                        {msgGeneral}
                                                    </div>
                                                }
                                                <div className="form-group mx-4 mb-3">
                                                    <label className="form-label" htmlFor="cover">Photo de couverture <span className="text-bold text-danger text-sm">*</span> ({acceptCoverExtension})</label>
                                                    <input 
                                                        onChange={(event)=>{onCoverChange(event)}}
                                                        type="file"
                                                        accept={acceptCoverExtension}
                                                        className="form-control border border-outline-primary"
                                                        id="cover"
                                                        name="cover"
                                                        hidden/>
                                                    <p className="form-control border border-outline-primary p-0">
                                                        <button className="btn btn-light" onClick={(event)=>{event.preventDefault(); document.querySelector('#cover').click();}}>Parcourir...</button>
                                                        <label className="mx-3">
                                                            {coverName != ''
                                                                ? <>{coverName}</>
                                                                : 'Aucune photo sélectionnée.'
                                                            }
                                                        </label>
                                                        <a onClick={(event)=>{event.preventDefault(); clearCover()}} className="close-document text-dark float-end" style={{ display: (coverName != '') ? 'block' : 'none' }}><i className="bi bi-x-lg"></i></a>
                                                    </p>
                                                    {coverName != '' &&
                                                        <img id="cover-img" src={coverFile} className="img-thumbnail w-50" />
                                                    }
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <input 
                                                        onChange={(event)=>{setTitle(event.target.value)}}
                                                        value={title}
                                                        type="text"
                                                        className="form-control border border-outline-primary"
                                                        id="title"
                                                        name="title"
                                                        placeholder="Titre"/>
                                                    <label htmlFor="title">Titre <span className="text-bold text-danger text-sm">*</span></label>
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <input 
                                                        onChange={(event)=>{setVideo(event.target.value)}}
                                                        value={video}
                                                        type="text"
                                                        className="form-control border border-outline-primary"
                                                        id="video"
                                                        name="video"
                                                        placeholder="URL vidéo"/>
                                                    <label htmlFor="video">URL vidéo <span className="text-bold text-danger text-sm">*</span></label>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                                {isFetched &&
                                    <div className="card-footer bg-white p-3">
                                        <div className="w-100 text-center">
                                            <button 
                                                disabled={isSaving} 
                                                type="submit"
                                                className="btn btn-sm btn-outline-primary mx-1">
                                                <i className="bi bi-save me-1"></i> 
                                                Mettre à jour
                                            </button>
                                            <Link
                                                to="/admin/videotheques"
                                                className="btn btn-sm btn-outline-secondary mx-1">
                                                <i className="bi bi-list me-1"></i>
                                                Liste
                                            </Link>
                                        </div>
                                    </div>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
  
export default VideothequeEdit;