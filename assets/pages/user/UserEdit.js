import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate, Navigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

function UserEdit() {
	const [id, setId] = useState(useParams().id)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [statut, setStatut] = useState('Actif')
    const [email, setEmail] = useState('')
    const [emailToEdit, setEmailToEdit] = useState('')
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState([])
    const [rolesOptions, setRolesOptions] = useState([])
    const [statutOptions, setStatutOptions] = useState([])
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const [isParameterError, setIsParameterError] = useState(false)
    const [msgParameter, setMsgParameter] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()

    if (id == '1') {
        toast.warning('Action refusée! Redirection vers liste.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        return (<Navigate to="/admin/users" />)
    }

    useEffect(() => {
    	setIsGeneralError(false)
        setMsgGeneral("")
        setIsParameterError(false)
        setMsgParameter("")
    	setIsSaving(true)
        showLoader()
        axios.get(`/api/user_fo/${id}`)
        .then(function (response) {
            let user = response.data
            setRolesOptions(user.rolesOptions)
            setStatutOptions(user.statutOptions)
            setFirstname(user.firstname)
            setLastname(user.lastname)
            setPhone(user.phone)
            setAddress(user.address)
            setEmail(user.email)
            setEmailToEdit(user.email)
            setPassword('')
            setRoles(user.roles)
            setStatut(user.statut)
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
            navigate("/admin/users")
        })
    }, [])
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            firstname == '' 
            || statut == '' 
            || email == '' 
            || !validateEmail(email) 
            || roles == '' 
        ) {
            if (firstname == '') {
                setIsGeneralError(true)
                setMsgGeneral("Le champ \"Nom\" est requis.")
            } else {
                setIsGeneralError(false)
                setMsgGeneral("")
            }
            if (
                statut == '' 
                || email == '' 
                || !validateEmail(email) 
                || roles == '' 
            ) {
                setIsParameterError(true)
                if (statut == '') setMsgParameter("Le champ \"Statut\" est requis.")
                if (roles == '') setMsgParameter("Le champ \"Type de compte\" est requis.")
                if (!validateEmail(email)) setMsgParameter("Veuillez saisir un e-mail valide.")
                if (email == '') setMsgParameter("Le champ \"E-mail\" est requis.")
            }
            setIsSaving(false)
            hideLoader()
        } else {
        	setIsGeneralError(false)
			setMsgGeneral("")
        	setIsParameterError(false)
			setMsgParameter("")
            let formData = new FormData()
            formData.append("action", "modify")
            formData.append("firstname", firstname)
            formData.append("lastname", lastname)
            formData.append("address", address)
            formData.append("phone", phone)
            formData.append("statut", statut)
            formData.append("email", email)
            formData.append("emailToEdit", emailToEdit)
            formData.append("password", password)
            formData.append("roles", roles)
            axios.post(`/api/user_fo/edit/${id}`, formData)
                .then(function (response) {
                    hideLoader()
                    if (!response.data.success) {
                        setIsParameterError(true)
                        setMsgParameter(response.data.msg)
                        setIsSaving(false)
                    } else {
                        toast.success("Utilisateur modifié avec succès.", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        })
                        setIsParameterError(false)
                        setMsgParameter("")
                        setIsSaving(true)
                        setFirstname('')
                        setLastname('')
                        setPhone('')
                        setAddress('')
                        setEmail('')
                        setPassword('')
                        setRoles(['ROLE_ADMIN'])
                        setStatut(['Actif'])
                        navigate("/admin/users")
                    }
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
                    navigate('/admin/users')
                });
        }
    }

    const changeRoles = (selectedOptions) => {
        setRoles(selectedOptions.selectedKey)
    }

    const changeStatut = (selectedOptions) => {
        setStatut(selectedOptions.selectedKey)
    }

    const validateEmail = (emailValue) => {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(String(emailValue).toLowerCase())
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Utilisateurs</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/users">Utilisateurs</Link></li>
                        <li className="breadcrumb-item active">Modifier</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-3">
                            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                                <div className="card-body p-3">
                                    <div className="mt-2 mb-4"><h4>Modifier un utilisateur</h4></div>
                                    <hr className="mt-2 mb-4"/>
                                    {!isFetched ? <div className="text-center text-sm p-0 pb-3"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                                        :
                                        <>
                                            <div className="w-100 mb-4">
                                                <h5 className="text-muted mx-4 mb-3">Informations générales</h5>
                                                {isGeneralError &&
                                                    <div className="mx-4 mt-3 mb-3 alert alert-warning text-center form-error">
                                                        <i className="fa fa-exclamation-triangle fa-fw mx-1"></i>
                                                        {msgGeneral}
                                                    </div>
                                                }
                                                <div className="form-floating mx-4 mb-3">
                                                    <input 
                                                        onChange={(event)=>{setFirstname(event.target.value)}}
                                                        value={firstname}
                                                        type="text"
                                                        className="form-control border border-outline-primary"
                                                        id="firstname"
                                                        name="firstname"
                                                        placeholder="Nom"/>
                                                    <label htmlFor="firstname">Nom <span className="text-bold text-danger text-sm">*</span></label>
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <input 
                                                        onChange={(event)=>{setLastname(event.target.value)}}
                                                        value={lastname}
                                                        type="text"
                                                        className="form-control border border-outline-primary"
                                                        id="lastname"
                                                        name="lastname"
                                                        placeholder="Prénom"/>
                                                    <label htmlFor="lastname">Prénom</label>
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <input 
                                                        onChange={(event)=>{setPhone(event.target.value)}}
                                                        value={phone}
                                                        type="text"
                                                        className="form-control border border-outline-primary"
                                                        id="phone"
                                                        name="phone"
                                                        placeholder="Téléphone"/>
                                                    <label htmlFor="phone">Téléphone</label>
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <textarea 
                                                        value={address}
                                                        onChange={(event)=>{setAddress(event.target.value)}}
                                                        className="form-control border border-outline-primary h-auto"
                                                        id="address"
                                                        rows="4"
                                                        name="address"
                                                        placeholder="Adresse"></textarea>
                                                    <label htmlFor="address">Adresse</label>
                                                </div>
                                            </div>
                                            <hr className="mt-5 mb-4"/>
                                            <div className="w-100 mb-4">
                                                <h5 className="text-muted mx-4 mb-3">Paramètres de compte</h5>
                                                {isParameterError &&
                                                    <div className="mx-4 mt-3 mb-3 alert alert-warning text-center form-error">
                                                        <i className="fa fa-exclamation-triangle fa-fw mx-1"></i>
                                                        {msgParameter}
                                                    </div>
                                                }
                                                <div className="form-floating mx-4 mb-3">
                                                    <input 
                                                        onChange={(event)=>{setEmail(event.target.value)}}
                                                        value={email}
                                                        type="text"
                                                        className="form-control border border-outline-primary"
                                                        id="email"
                                                        name="email"
                                                        placeholder="E-mail"/>
                                                    <label htmlFor="email">E-mail <span className="text-bold text-danger text-sm">*</span></label>
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <input 
                                                        onChange={(event)=>{setPassword(event.target.value)}}
                                                        value={password}
                                                        type="password"
                                                        className="form-control border border-outline-primary"
                                                        id="password"
                                                        name="password"
                                                        placeholder="Mot de passe"/>
                                                    <label htmlFor="password">Mot de passe</label>
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <label htmlFor="roles">Type de compte <span className="text-bold text-danger text-sm">*</span></label>
                                                    <BootstrapSelect
                                                        id="roles"
                                                        options={rolesOptions}
                                                        placeholder={"Choisissez un type"}
                                                        className="form-control border border-outline-primary bg-white"
                                                        onChange={changeRoles} />
                                                    <label htmlFor="roles">Type de compte <span className="text-bold text-danger text-sm">*</span></label>
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <BootstrapSelect
                                                        id="statut"
                                                        options={statutOptions}
                                                        placeholder={"Choisissez un statut"}
                                                        className="form-control border border-outline-primary bg-white"
                                                        onChange={changeStatut} />
                                                    <label htmlFor="statut">Statut <span className="text-bold text-danger text-sm">*</span></label>
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
                                                to="/admin/users"
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
  
export default UserEdit;