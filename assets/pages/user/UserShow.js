import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate, Navigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

function UserShow() {
	const [id, setId] = useState(useParams().id)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [statut, setStatut] = useState('Actif')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState([])
    const [rolesOptions, setRolesOptions] = useState([])
    const [statutOptions, setStatutOptions] = useState([])
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
            setPassword('')
            setRoles(user.roles)
            setStatut(user.statut)
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
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Utilisateurs</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/users">Utilisateurs</Link></li>
                        <li className="breadcrumb-item active">Détails</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-3">
                            <div className="card-body p-3">
                                <div className="mt-2 mb-4"><h4>Détails d'un utilisateur</h4></div>
                                <hr className="mt-2 mb-4"/>
                                {!isFetched ? <div className="text-center text-sm p-0 pb-3"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                                    :
                                    <>
                                        <div className="w-100 mb-4">
                                            <h5 className="text-muted mx-4 mb-3">Informations générales</h5>
                                            <div className="form-floating bg-white mx-4 mb-3">
                                                <input 
                                                    onChange={(event)=>{setFirstname(event.target.value)}}
                                                    value={firstname}
                                                    type="text"
                                                    className="form-control border border-outline-primary bg-white"
                                                    id="firstname"
                                                    name="firstname"
                                                    disabled={true}/>
                                                <label htmlFor="firstname">Nom <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating bg-white mx-4 mb-3">
                                                <input 
                                                    onChange={(event)=>{setLastname(event.target.value)}}
                                                    value={lastname}
                                                    type="text"
                                                    className="form-control border border-outline-primary bg-white"
                                                    id="lastname"
                                                    name="lastname"
                                                    disabled={true}/>
                                                <label htmlFor="lastname">Prénom</label>
                                            </div>
                                            <div className="form-floating bg-white mx-4 mb-3">
                                                <input 
                                                    onChange={(event)=>{setPhone(event.target.value)}}
                                                    value={phone}
                                                    type="text"
                                                    className="form-control border border-outline-primary bg-white"
                                                    id="phone"
                                                    name="phone"
                                                    disabled={true}/>
                                                <label htmlFor="phone">Téléphone</label>
                                            </div>
                                            <div className="form-floating bg-white mx-4 mb-3">
                                                <textarea 
                                                    value={address}
                                                    onChange={(event)=>{setAddress(event.target.value)}}
                                                    className="form-control border border-outline-primary bg-white h-auto"
                                                    id="address"
                                                    rows="4"
                                                    name="address"
                                                    disabled={true}></textarea>
                                                <label htmlFor="address">Adresse</label>
                                            </div>
                                        </div>
                                        <hr className="mt-5 mb-4"/>
                                        <div className="w-100 mb-4">
                                            <h5 className="text-muted mx-4 mb-3">Paramètres de compte</h5>
                                            <div className="form-floating bg-white mx-4 mb-3">
                                                <input 
                                                    onChange={(event)=>{setEmail(event.target.value)}}
                                                    value={email}
                                                    type="text"
                                                    className="form-control border border-outline-primary bg-white"
                                                    id="email"
                                                    name="email"
                                                    disabled={true}/>
                                                <label htmlFor="email">E-mail <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating bg-white mx-4 mb-3">
                                                <BootstrapSelect
                                                    id="roles"
                                                    options={rolesOptions}
                                                    placeholder={"Choisissez un type"}
                                                    className="form-control border border-outline-primary bg-white"
                                                    disabled={true} />
                                                <label htmlFor="roles">Type de compte <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating bg-white mx-4 mb-3">
                                                <BootstrapSelect
                                                    id="statut"
                                                    options={statutOptions}
                                                    placeholder={"Choisissez un statut"}
                                                    className="form-control border border-outline-primary bg-white"
                                                    disabled={true} />
                                                <label htmlFor="statut">Statut <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            {isFetched &&
                                <div className="card-footer bg-white p-3">
                                    <div className="w-100 text-center">
                                        {id != '1' &&
                                            <Link
                                                className="btn btn-sm btn-outline-success mx-1"
                                                to={`/admin/users/edit/${id}`}>
                                                <i className="bi bi-pencil-square me-1"></i>
                                                Modifier
                                            </Link>
                                        }
                                        <Link
                                            to="/admin/users"
                                            className="btn btn-sm btn-outline-secondary mx-1">
                                            <i className="bi bi-list me-1"></i>
                                            Liste
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
  
export default UserShow;