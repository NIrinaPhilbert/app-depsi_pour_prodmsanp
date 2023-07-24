import React, {useState, useEffect, useRef} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react';

const acceptDocExtension = ".jpeg,.jpg,.png"
const acceptDocFormat = [
    'image/jpeg',
    'image/png'
]

function HomeEdit() {
    const [id, setId] = useState(useParams().id)
    const [title, setTitle] = useState('')
    const [imageName, setImageName] = useState('')
    const [imageNameToEdit, setImageNameToEdit] = useState('')
    const [imageFile, setImageFile] = useState({})
    const [previewSource, setPreviewSource] = useState(null)
    const [textContent, setTextContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()
    const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches
    const textContentRef = useRef(null)

    useEffect(() => {
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/home/${id}`)
        .then(function (response) {
            let doc = response.data
            setTitle(doc.title)
            setImageName(doc.imageName)
            setImageNameToEdit(doc.imageName)
            setImageFile(doc.imageFile)
            setTextContent(doc.textContent)
            setIsSaving(false)
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
            navigate("/admin")
        })
    }, [])
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            title == '' 
            || imageName == '' 
            || (!acceptDocFormat.includes(imageFile.type) && imageName != imageNameToEdit)
        ) {
            goToTop(0, 0)
            setIsGeneralError(true)
            if (imageName == '') {
                document.querySelector("#doc").value = ''
                setMsgGeneral("Le champ \"Image\" est requis.")
            }
            else if (!acceptDocFormat.includes(imageFile.type) && imageName != imageNameToEdit) {
                document.querySelector("#doc").value = ''
                setMsgGeneral("Type de fichier invalide. Choisissez entre : "+acceptDocExtension)
            }
            else if (title == '') setMsgGeneral("Le champ \"Titre\" est requis.")
            else setMsgGeneral("Une erreur quelconque est survenue.")
            setIsSaving(false)
            hideLoader()
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            let formData = new FormData()
            formData.append("action", "modify")
            formData.append("imageFile", imageFile)
            formData.append("imageName", imageName)
            formData.append("imageNameToEdit", imageNameToEdit)
            formData.append("title", title)
            formData.append("textContent", textContentRef.current.getContent())
            axios.post(`/api/home/edit/${id}`, formData)
                .then(function (response) {
                    hideLoader()
                    toast.success("Donnée modifiée avec succès.", {
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
                    setImageName('')
                    setImageNameToEdit('')
                    setImageFile({})
                    setTitle('')
                    setTextContent('')
                    navigate("/admin")
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
                    setIsSaving(true)
                    navigate('/admin')
                });
        }
    }

    const onDocChange = (event) => {
        var thisFile = event.target.files[0]
        setImageFile(thisFile)
        previewFile(thisFile)
        if (!acceptDocFormat.includes(thisFile.type)) {
            goToTop(0, 0)
            setIsGeneralError(true)
            setMsgGeneral("Type de fichier invalide. Choisissez entre : "+acceptDocExtension)
            setImageName("")
            document.querySelector("#doc").value = ''
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            setImageName(thisFile.name)
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    const clearDoc = () => {
        setImageFile({})
        setImageName('')
        setPreviewSource(null)
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Accueil</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/home">Accueil</Link></li>
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
                                    <div className="mt-2 mb-4"><h4>Modifier une donnée</h4></div>
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
                                                    <label className="form-label" htmlFor="doc">Image <span className="text-bold text-danger text-sm">*</span> ({acceptDocExtension})</label>
                                                    <input 
                                                        onChange={(event)=>{onDocChange(event)}}
                                                        type="file"
                                                        accept={acceptDocExtension}
                                                        className="form-control border border-outline-primary"
                                                        id="doc"
                                                        name="doc"
                                                        hidden/>
                                                    <p className="form-control border border-outline-primary p-0">
                                                        <button className="btn btn-light" onClick={(event)=>{event.preventDefault(); document.querySelector('#doc').click();}}>Parcourir...</button>
                                                        <label className="mx-3">
                                                            {imageName != ''
                                                                ? <><i className="bi bi-file-image me-1"></i>{imageName}</>
                                                                : 'Aucune image sélectionnée.'
                                                            }
                                                        </label>
                                                        <a onClick={(event)=>{event.preventDefault(); clearDoc()}} className="close-document text-dark float-end" style={{ display: (imageName != '') ? 'block' : 'none' }}><i className="bi bi-x-lg"></i></a>
                                                    </p>
                                                    {previewSource && (
                                                        <p>
                                                            <img src={previewSource} className={`img-thumbnail`} alt="Preview" style={{ maxWidth: '275px' }} />
                                                        </p>
                                                    )}
                                                    {(previewSource == null && imageName != '') && (
                                                        <p>
                                                            <img src={imageFile} className={`img-thumbnail`} alt="Preview" style={{ maxWidth: '275px' }} />
                                                        </p>
                                                    )}
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
                                                <div className="form-group mx-4 mb-3">
                                                    <label className="form-label">Contenu</label>
                                                    <Editor
                                                        onInit={(evt, editor) => textContentRef.current = editor}
                                                        initialValue={textContent}
                                                        init={{
                                                            language: 'fr_FR',
                                                            height: 500,
                                                            toolbar_sticky: true,
                                                            toolbar_sticky_offset: isSmallScreen ? 102 : 108,
                                                            menubar: 'file edit view insert format tools table help',
                                                            plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                                                            toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                                        }}
                                                    />
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
                                                to="/admin/home"
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
  
export default HomeEdit;