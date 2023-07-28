import React, {useState, useEffect, useRef} from 'react'
import { Link, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react';

function OrganigrammeDepsi() {
    const [textContent, setTextContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isFetched, setIsFetched] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const navigate = useNavigate()
    const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches
    const textContentRef = useRef(null)

    useEffect(() => {
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/organigrammedepsi`)
        .then(function (response) {
            let aboutData = response.data
            console.log((aboutData))
            console.log("=====================")
            setTextContent(aboutData.textContent)
            console.log(aboutData.textContent)
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
        setIsGeneralError(false)
        setMsgGeneral("")
        let formData = new FormData()
        formData.append("action", "maj")
        formData.append("textContent", textContentRef.current.getContent())
        axios.post('/api/organigrammedepsi/maj', formData)
            .then(function (response) {
                hideLoader()
                toast.success("Elément mis à jour avec succès.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
                setIsSaving(false)
                navigate("/admin/organigrammedepsi")
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
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>A propos</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/organigrammedepsi">Organigramme DEPSI</Link></li>
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
                                    <div className="mt-2 mb-4"><h4>Mettre à jour</h4></div>
                                    <hr className="mt-2 mb-4"/>
                                    <div className="w-100 mb-4">
                                        {isGeneralError &&
                                            <div className="mx-4 mt-3 mb-3 alert alert-warning text-center form-error">
                                                <i className="fa fa-exclamation-triangle fa-fw mx-1"></i>
                                                {msgGeneral}
                                            </div>
                                        }
                                        <div className="mx-4 mb-3">
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
                                </div>
                                <div className="card-footer bg-white p-3">
                                    <div className="w-100 text-center">
                                        <button 
                                            disabled={isSaving} 
                                            type="submit"
                                            className="btn btn-sm btn-outline-primary mx-1">
                                            <i className="bi bi-save me-1"></i> 
                                            Mettre à jour
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
  
export default OrganigrammeDepsi;