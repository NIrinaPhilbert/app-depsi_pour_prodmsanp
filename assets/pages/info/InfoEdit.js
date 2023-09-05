import React, {useState, useEffect, useRef} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react';

let document_access_keys = process.env.DOCUMENT_ACCESS_KEYS
document_access_keys = document_access_keys.split('|')


function InfoEdit() {
    const [id, setId] = useState(useParams().id)
    const [title, setTitle] = useState('')
    const [textContent, setTextContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const [documentAccessOptions, setDocumentAccessOptions] = useState([])
    const [documentAccess, setDocumentAccess] = useState(document_access_keys[0])
    const navigate = useNavigate()
    const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches
    const textContentRef = useRef(null)



    useEffect(() => {
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/infos/${id}`)
        .then(function (response) {
            let info = response.data
            setTitle(info.title)
            setTextContent(info.textContent)
            setDocumentAccessOptions(info.documentAccessOptions)
            setDocumentAccess([info.documentAccess])
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
            navigate("/admin/infos")
        })
    }, [])
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            title == ''
        ) {
            setIsGeneralError(true)
            if (title == '') setMsgGeneral("Le champ \"Titre\" est requis.")
            goToTop(0, 0)
            setIsSaving(false)
            hideLoader()
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            let formData = new FormData()
            formData.append("action", "modify")
            formData.append("title", title)
            formData.append("textContent", textContentRef.current.getContent())
            formData.append("infoaccess", documentAccess)
            axios.post(`/api/infos/edit/${id}`, formData)
                .then(function (response) {
                    hideLoader()
                    toast.success("Information modifiée avec succès.", {
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
                    setTitle('')
                    setTextContent('')
                    setDocumentAccess([document_access_keys[0]])
                    navigate("/admin/infos")
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
                    navigate('/admin/infos')
                });
        }
    }
    const changeDocumentAccess = (selectedOptions) => {
        setDocumentAccess(selectedOptions.selectedKey)
    }
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Informations de base</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/infos">Informations</Link></li>
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
                                    <div className="mt-2 mb-4"><h4>Modifier une information</h4></div>
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
                                                <div className="form-floating mx-4 mb-3">
                                                    <BootstrapSelect
                                                        id="document_access"
                                                        options={documentAccessOptions}
                                                        placeholder={"Choisissez un type d'accès"}
                                                        className="form-control border border-outline-primary bg-white"
                                                        onChange={changeDocumentAccess} />
                                                    <label htmlFor="document_access">Type d'accès <span className="text-bold text-danger text-sm">*</span></label>
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
                                                    <label className="form-label">Longue description</label>
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
                                                to="/admin/infos"
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
  
export default InfoEdit;