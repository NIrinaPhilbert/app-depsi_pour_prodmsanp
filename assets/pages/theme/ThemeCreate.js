import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

function ThemesCreate() {
    const [posttype, setPostType] = useState([])
    const [posttypeOptions, setPostTypeOptions] = useState([])
    const [designation, setDesignation] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/themes/posttypeOptions`)
        .then(function (response) {
            setPostTypeOptions(response.data)
            setIsSaving(false)
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
            navigate("/admin/themes")
        })
    }, [])
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            designation == '' 
            || posttype == ''
        ) {
            goToTop(0, 0)
            setIsGeneralError(true)
            if (designation == '') setMsgGeneral("Le champ \"Designation\" est requis.")
            else if (posttype == '') setMsgGeneral("Le champ \"Type de publication\" est requis.")
            else setMsgGeneral("Une erreur quelconque est survenue.")
            setIsSaving(false)
            hideLoader()
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            let formData = new FormData()
            formData.append("action", "add")
            formData.append("posttype", posttype)
            formData.append("designation", designation)
            axios.post('/api/themes/create', formData)
                .then(function (response) {
                    hideLoader()
                    toast.success("Thèmatique ajoutée avec succès.", {
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
                    setDesignation('')
                    setPostType([])
                    navigate("/admin/themes")
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
                    navigate('/admin/themes')
                });
        }
    }

    const changePostType = (selectedOptions) => {
        setPostType(selectedOptions.selectedKey)
    }

    return (
        <Layout>
            <div className="pagetitle">
                <h1>Thèmatiques</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/themes">Thèmatiques</Link></li>
                        <li className="breadcrumb-item active">Ajout</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-3">
                            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                                <div className="card-body p-3">
                                    <div className="mt-2 mb-4"><h4>Créer une nouvelle thèmatique</h4></div>
                                    <hr className="mt-2 mb-4"/>
                                    <div className="w-100 mb-4">
                                        {isGeneralError &&
                                            <div className="mx-4 mt-3 mb-3 alert alert-warning text-center form-error">
                                                <i className="fa fa-exclamation-triangle fa-fw mx-1"></i>
                                                {msgGeneral}
                                            </div>
                                        }
                                        <div className="form-floating mx-4 mb-3">
                                            <BootstrapSelect
                                                id="posttype"
                                                options={posttypeOptions}
                                                placeholder={"Choisissez une type de publication"}
                                                className="form-control border border-outline-primary bg-white"
                                                onChange={changePostType} />
                                            <label htmlFor="posttype">Type de publication <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <input 
                                                onChange={(event)=>{setDesignation(event.target.value)}}
                                                value={designation}
                                                type="text"
                                                className="form-control border border-outline-primary"
                                                id="designation"
                                                name="designation"
                                                placeholder="Designation"/>
                                            <label htmlFor="designation">Designation <span className="text-bold text-danger text-sm">*</span></label>
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
                                            Enregistrer
                                        </button>
                                        <Link
                                            to="/admin/themes"
                                            className="btn btn-sm btn-outline-secondary mx-1">
                                            <i className="bi bi-list me-1"></i>
                                            Liste
                                        </Link>
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
  
export default ThemesCreate;