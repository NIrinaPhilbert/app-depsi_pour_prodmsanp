import React, {useState, useRef} from 'react'
import { Link, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

function DirectionCreate() {
    const [nom, setNom] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const navigate = useNavigate()
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            nom == ''
        ) {
            goToTop(0, 0)
            setIsGeneralError(true)
            setMsgGeneral("Le champ \"Nom\" est requis.")
            setIsSaving(false)
            hideLoader()
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            let formData = new FormData()
            formData.append("action", "add")
            formData.append("nom", nom)
            axios.post('/api/direction/create', formData)
                .then(function (response) {
                    hideLoader()
                    toast.success("Direction ajoutée avec succès.", {
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
                    setNom('')
                    navigate("/admin/directions")
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
                    navigate('/admin/directions')
                });
        }
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Directions</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/directions">Directions</Link></li>
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
                                    <div className="mt-2 mb-4"><h4>Créer une nourvelle direction</h4></div>
                                    <hr className="mt-2 mb-4"/>
                                    <div className="w-100 mb-4">
                                        {isGeneralError &&
                                            <div className="mx-4 mt-3 mb-3 alert alert-warning text-center form-error">
                                                <i className="fa fa-exclamation-triangle fa-fw mx-1"></i>
                                                {msgGeneral}
                                            </div>
                                        }
                                        <div className="form-floating mx-4 mb-3">
                                            <input 
                                                onChange={(event)=>{setNom(event.target.value)}}
                                                value={nom}
                                                type="text"
                                                className="form-control border border-outline-primary"
                                                id="nom"
                                                name="nom"
                                                placeholder="Nom"/>
                                            <label htmlFor="nom">Nom <span className="text-bold text-danger text-sm">*</span></label>
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
                                            to="/admin/directions"
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
  
export default DirectionCreate;