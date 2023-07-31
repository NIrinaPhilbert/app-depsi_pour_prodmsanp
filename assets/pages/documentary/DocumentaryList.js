import React,{ useState, useEffect} from 'react'
import { Link, useNavigate, Navigate } from "react-router-dom"
import Layout from "../../components/Layout"
import Swal from 'sweetalert2'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

let document_access_keys = process.env.DOCUMENT_ACCESS_KEYS
document_access_keys = document_access_keys.split('|')
let document_access_values = process.env.DOCUMENT_ACCESS_VALUES
document_access_values = document_access_values.split('|')
const accesses = document_access_keys.reduce((arr, key, index) => {
    arr[key] = document_access_values[index]
    return arr
}, {})
 
function DocumentaryList() {
    const  [docList, setDocList] = useState([])
    const  [isFecthed, setIsFetched] = useState(false)
    const navigate = useNavigate()
    const shouldRedirect = (localStorage.getItem('mysession') === null) ? true : false

    if (shouldRedirect) {
    	showLoader()
		return (
			<>
				{shouldRedirect && window.location.reload()}
			</>
		);
	}
    
	const columns = [
        {
            name: '#ID',
            selector: row => row.id,
            sortable: true,
            cell: row => <div style={{display: 'block'}}><b>#{row.id}</b></div>
        },
        {
            name: 'Titre',
            selector: row => row.title,
            sortable: true,
            cell: row => <div style={{display: 'block'}}>{row.title}</div>
        },
        {
            name: 'Couverture',
            selector: row => row.coverName,
            sortable: false,
            cell: row => <div style={{display: 'block', minWidth: '120px'}}>{row.coverName}</div>
        },
        {
            name: 'Accès',
            selector: row => row.documentAccess,
            sortable: false,
            cell: row => <div style={{display: 'block', minWidth: '120px'}}>{row.documentAccess}</div>
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            cell: row => <div style={{display: 'block'}}>{row.date}</div>
        },
        /*
        {
            name: 'Auteur',
            selector: row => row.author,
            sortable: true,
            cell: row => <div style={{display: 'block'}}>{row.author}</div>
        },
        */
        {
             name: 'Type de publication',
             selector: row => row.pub_type,
             sortable: true,
             cell: row => <div style={{display: 'block'}}>{row.pub_type}</div>
        },
        {
             name: 'Thématique',
             selector: row => row.thematic,
             sortable: true,
             cell: row => <div style={{display: 'block'}}>{row.thematic}</div>
        },
        {
            name: 'Direction',
            selector: row => row.direction,
            sortable: true,
            cell: row => <div style={{display: 'block'}}>{row.direction}</div>
        },
        {
             name: 'Entité source',
            selector: row => row.entities,
             sortable: true,
             cell: row => <div style={{display: 'block'}}>{row.entities}</div>
        },
        
        {
            name: 'Actions',
            selector: row => row.actions,
            sortable: false,
            cell: row => <div style={{display: 'inherit'}}>{row.actions}</div>
        },
    ];
    const paginationComponentOptions = {
        rowsPerPageText: 'Lignes par page',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tous',
    };
  
    useEffect(() => {
        fetchDocsList()
    }, [])
  
    const fetchDocsList = () => {
    	setIsFetched(false)
        showLoader()
        axios.get('/api/docs')
        .then(function (response) {
			setIsFetched(true)
			response.data.map((doc, key)=>{
                var accessClass = (doc.documentAccess == document_access_keys[0]) ? 'badge bg-primary' : 'badge bg-danger'
                doc.documentAccess = (
                    <span className={accessClass}>{accesses[doc.documentAccess]}</span>
                )
                doc.title = (
                    <>
                        <Link
                            to={`/admin/documentaryresources/show/${doc.id}`}
                            className="d-block w-100">
                            {doc.title}
                        </Link>
                    </>
                )
                if (doc.coverName != '') {
                    doc.coverName = (
                        <>
                            <a
                                href={`${doc.coverFile}`}
                                target="blank">
                                <img className="img-thumbnail w-100" src={doc.coverFile} />
                            </a>
                        </>
                    )
                }
                doc.actions = (
                    <>
                        <Link
                            className="btn btn-sm btn-outline-success mx-1"
                            to={`/admin/documentaryresources/edit/${doc.id}`}>
                            <i className="bi bi-pencil-square"></i>
                        </Link>
                        <button 
                            onClick={()=>handleDelete(doc.id)}
                            className="btn btn-sm btn-outline-danger mx-1">
                            <i className="bi bi-trash"></i>
                        </button>
                    </>
                )
                return doc
            })
			setDocList(response.data)
			hideLoader()
        })
        .catch(function (error) {
            toast.error('Une erreur doc list est survenue.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        })
    }

    const handleRefresh = () => {
    	fetchDocsList()
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Voulez-vous supprimer cette ressource?',
            text: "Cette action est irréversible!",
            icon: 'warning',
            showCancelButton: true,
            customClass: {
	            confirmButton: 'btn btn-md btn-outline-primary',
	            cancelButton: 'btn btn-md btn-outline-secondary ms-2'
	        },
	        buttonsStyling: false,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed) {
                showLoader()
                axios.delete(`/api/docs/remove/${id}`)
                .then(function (response) {
                	if (response.data.success) {
	                    toast.success("Ressource supprimée avec succès.", {
	                        position: "top-right",
	                        autoClose: 5000,
	                        hideProgressBar: false,
	                        closeOnClick: true,
	                        pauseOnHover: true,
	                        draggable: true,
	                        progress: undefined,
	                        theme: "colored",
	                    })
	                    fetchDocsList()
	                } else {
	                	toast.error('Suppression impossible.', {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "colored",
						});
						hideLoader()
	                }
                })
                .catch(function (error) {
                    toast.error('Une erreur verif final est survenue.', {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});
                    hideLoader()
                });
            }
          })
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Ressources documentaires</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/documentaryresources">Ressources documentaires</Link></li>
                        <li className="breadcrumb-item active">Liste</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-3">
                            <div className="card-body p-3">
                            	<div className="mb-2 mt-1">
                                	<Link
                                        to="/admin/documentaryresources/new"
                                        className="btn btn-sm btn-outline-primary mx-1">
                                        <i className="bi bi-plus-circle me-1"></i>
                                        Créer
                                    </Link>
                                    <button 
                                        onClick={()=>handleRefresh()}
                                        className="btn btn-sm btn-outline-secondary mx-1">
                                        <i className="bi bi-bootstrap-reboot me-1"></i>
                                        Actualiser
                                    </button>
            					</div>
                                <DataTable 
                                    columns={columns} 
                                    data={docList} 
                                    pagination 
                                    paginationComponentOptions={paginationComponentOptions} 
                                    progressComponent={<div className="text-sm p-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>} 
                                    progressPending={!isFecthed} 
                                    highlightOnHover={true} 
                                    noDataComponent={<div className="p-2">Aucune ressource trouvée.</div>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
  
export default DocumentaryList;