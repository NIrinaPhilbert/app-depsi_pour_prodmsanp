import React,{ useState, useEffect} from 'react'
import { Link, useNavigate, Navigate } from "react-router-dom"
import Layout from "../../components/Layout"
import Swal from 'sweetalert2'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
 
function ThemesList() {
    const  [themesList, setThemesList] = useState([])
    const  [isFecthed, setIsFetched] = useState(false)
    const navigate = useNavigate()
    const shouldRedirect = (localStorage.getItem('mysession') === null) ? true : false
    // amelioration 04092023
    const [themesListSearch, setThemesListSearch] = useState([])
    const initialSearch = {
        item: ''
    }
    const [searchData, setSearchData] = useState(initialSearch)
    // /. amelioration 04092023
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
            name: 'Type publication',
            selector: row => row.type_publication,
            sortable: false,
            cell: row => <div style={{display: 'block', minWidth: '120px'}}>{row.type_publication}</div>
        },
        {
            name: 'Thèmatique',
            selector: row => row.designation,
            sortable: true,
            cell: row => <div style={{display: 'block'}}>{row.designation}</div>
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
        fetchThemesList()
    }, [])
  
    const fetchThemesList = () => {
    	setIsFetched(false)
        showLoader()
        axios.get('/api/themes')
        .then(function (response) {
			setIsFetched(true)
			response.data.map((theme, key)=>{
                theme.actions = (
                    <>
                        <Link
                            className="btn btn-sm btn-outline-success mx-1"
                            to={`/admin/themes/edit/${theme.id}`}>
                            <i className="bi bi-pencil-square"></i>
                        </Link>
                        <button 
                            onClick={()=>handleDelete(theme.id)}
                            className="btn btn-sm btn-outline-danger mx-1">
                            <i className="bi bi-trash"></i>
                        </button>
                    </>
                )
                return theme
            })
			setThemesList(response.data)
            // amelioration 04092023
            setThemesListSearch(response.data)
            // /. amelioration 04092023
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
        })
    }

    const handleRefresh = () => {
         // amelioration 04092023
         setSearchData(initialSearch)
         // /. amelioration 04092023
    	fetchThemesList()
        
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Voulez-vous supprimer cette thèmatique?',
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
                axios.delete(`/api/themes/remove/${id}`)
                .then(function (response) {
                	if (response.data.success) {
	                    toast.success("Thème supprimée avec succès.", {
	                        position: "top-right",
	                        autoClose: 5000,
	                        hideProgressBar: false,
	                        closeOnClick: true,
	                        pauseOnHover: true,
	                        draggable: true,
	                        progress: undefined,
	                        theme: "colored",
	                    })
	                    fetchThemesList()
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
                    hideLoader()
                });
            }
          })
    }
    // amelioration 04092023
    const searchThemes = (key, val) => {
        var listInformations = [...themesListSearch]
        searchData[key] = val
        setSearchData(searchData)
        var filteredThemes = listInformations.filter((thisTheme) => {
            return (
                thisTheme.designation.toLowerCase().includes(searchData.item.toLowerCase()) || 
                thisTheme.type_publication.toLowerCase().includes(searchData.item.toLowerCase())
            )
        })
        setThemesList(filteredThemes)
    }
    // /. amelioration 07092023
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Thèmatiques</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/themes">Thèmatiques</Link></li>
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
                                        to="/admin/themes/new"
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
                                 {/* amelioration 04092023 */}
                                 {isFecthed &&
                                    <div className="mb-2 mt-2 float-end">
                                        <div className="form-floating">
                                            <input style={{"minWidth": "300px"}} id="item" type="text" className="form-control form-control-sm border-radius-0" defaultValue={searchData.item} onChange={(e)=>searchThemes('item', e.target.value)} placeholder="Tapez pour chercher..." />
                                            <label htmlFor="item">Recherche par designation ou type publication</label>
                                        </div>
                                    </div>
                                }
                                {/* /. amelioration 04092023 */}
                                <DataTable 
                                    columns={columns} 
                                    data={themesList} 
                                    pagination 
                                    paginationComponentOptions={paginationComponentOptions} 
                                    progressComponent={<div className="text-sm p-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>} 
                                    progressPending={!isFecthed} 
                                    highlightOnHover={true} 
                                    noDataComponent={<div className="p-2">Aucune thèmatique trouvée.</div>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
  
export default ThemesList;