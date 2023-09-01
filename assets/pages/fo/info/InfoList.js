import React,{ useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
 
function InfoList() {
    const [infosList, setInfosList] = useState([])
    const [titleSearch, setTitleSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pagination, setPagination] = useState([])
    const [isFetched, setIsFetched] = useState(false)

	useEffect(() => {
        fetchInfosList(currentPage, null)
    }, [])

    const fetchInfosList = (pageNumber, search) => {
        setIsFetched(false)
        showLoader()
        let formData = new FormData()
        formData.append("action", "search")
        formData.append("search", search != null ? JSON.stringify(search) : null)
        axios.post(`/api/infos_fo/${pageNumber}`, formData)
        .then(async function (response) {
            setIsFetched(true)
            setInfosList(await response.data.infos)
            setTotalItems(response.data.pagination.total_items)
            var paginate = []
            for (var i = 1; i <= response.data.pagination.total; i++) {
                paginate.push(i)
            }
            setPagination(paginate)
            setCurrentPage(pageNumber)
            // showContent(0, infosList[0].id)
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

    const handlePageChange = (pageNumber) => {
        let search = {
            'label': 'title',
            'text': titleSearch
        }
        fetchInfosList(pageNumber, search)
    }

    const searchInfos = (event, label, value) => {
        setTitleSearch(value)
        if (event.key == 'Enter') {
            let pageNumber = 1;
            let search = null;
            if (titleSearch != '') {
                search = {
                    'label': label,
                    'text': titleSearch
                }
            }
            fetchInfosList(pageNumber, search)
        }
    }

    const showContent = (key, id) => {
        let classELement = document.querySelector('#heading'+key+' > button').classList
        if (!classELement.contains('collapsed')) {
            infosList[key].textContent = '<div className="text-center text-sm p-0 py-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>'
            setInfosList([...infosList])
            axios.get(`/api/infos_fo/show/${id}`)
            .then(async function (response) {
                infosList[key].textContent = response.data.textContent
                setInfosList([...infosList])
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
        } else {
            infosList[key].textContent = ''
            setInfosList([...infosList])
        }
    }

    return (
        <LayoutFo>
            <div className="mb-2 px-2 py-3">
                <div className="w-100 border border-radius-0 p-3">
                    <div className="row">
                        <div className="col-12 mb-1">
                            <h5>Zone de recherche <small className="text-muted">(Ecrivez puis appuyez sur "Entrée")</small></h5>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-floating">
                                <input id="title" type="text" className="form-control form-control-sm border-radius-0" onKeyUp={(e)=>searchInfos(e, 'title', e.target.value)} placeholder="Titre" />
                                <label htmlFor="title">Titre</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!isFetched ? <div className="text-center text-sm p-0 pb-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    {infosList.length > 0 &&
                        <>
                            <nav className="mb-3" aria-label="Page navigation">
                                <ul className="pagination justify-content-end">
                                    <li>
                                    <button type="button" className="btn btn-info">Nombre résultats {totalItems}</button>
                                        
                                    </li>
                                    <li className={`page-item ${(currentPage <= 1) ? 'disabled' : ''}`}>
                                        {currentPage == 1
                                            ? <a className="page-link border-radius-0" tabIndex="-1" aria-disabled="true"><i className="bi bi-chevron-left"></i></a>
                                            : <a className="page-link border-radius-0" onClick={()=>handlePageChange(parseInt(currentPage)-1)}><i className="bi bi-chevron-left"></i></a>
                                        }
                                    </li>
                                    {pagination.map((pg, keyP)=>{
                                        return (
                                            <li className="page-item" key={keyP}>
                                                {currentPage == pg
                                                    ? <a className={`page-link border-radius-0 active`}>{pg}</a>
                                                    : <a className={`page-link border-radius-0`} onClick={()=>handlePageChange(pg)}>{pg}</a>
                                                }
                                            </li>
                                        )
                                    })}
                                    <li className={`page-item ${(currentPage == pagination.length) ? 'disabled' : ''}`}>
                                        {currentPage == pagination.length
                                            ? <a className="page-link border-radius-0" tabIndex="-1" aria-disabled="true"><i className="bi bi-chevron-right"></i></a>
                                            : <a className="page-link border-radius-0" onClick={()=>handlePageChange(parseInt(currentPage)+1)}><i className="bi bi-chevron-right"></i></a>
                                        }
                                    </li>
                                </ul>
                            </nav>
                        </>
                    }
                    <div className="row mb-3">
                        
                        {infosList.length == 0
                            ? <>
                                <div className="col-12">
                                    <div className="alert alert-info text-center border-radius-0 mb-0">
                                        <i className="bi bi-info-circle-fill me-2"></i>
                                        Aucune information trouvé.
                                    </div>
                                </div>
                            </>
                            : <>
                                <div className="accordion" id="accordionInfos">
                                    {infosList.map((info, key)=>{
                                        return (
                                            <div className={'accordion-item'} key={key}>
                                              <h1 className="accordion-header" id={'heading'+key} onClick={()=>showContent(key, info.id)}>
                                                <button className={'accordion-button'+(key > 0 ? ' collapsed' : '')} type="button" data-bs-toggle="collapse" data-bs-target={'#collapse'+key} aria-expanded={key == 0 ? 'true' : 'false'} aria-controls={'collapse'+key}>
                                                  <strong>#{key+1}</strong><label className="ms-2 cursor-pointer">{info.title}</label><label className="ms-2 cursor-pointer position-absolute" style={{ right: "3.75em" }}>{info.majAt}</label>
                                                </button>
                                              </h1>
                                              <div id={'collapse'+key} className={'accordion-collapse collapse'+(key == 0 ? ' show' : '')} aria-labelledby={'heading'+key} data-bs-parent="#accordionInfos">
                                                <div className="accordion-body">
                                                    {parse(info.textContent)}
                                                </div>
                                              </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                    </div>
                    {infosList.length > 0 &&
                        <>
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-end">
                                    <li>
                                        <button type="button" className="btn btn-info">Nombre résultats {totalItems}</button>
                                    </li>
                                    <li className={`page-item ${(currentPage <= 1) ? 'disabled' : ''}`}>
                                        {currentPage == 1
                                            ? <a className="page-link border-radius-0" tabIndex="-1" aria-disabled="true"><i className="bi bi-chevron-left"></i></a>
                                            : <a className="page-link border-radius-0" onClick={()=>handlePageChange(parseInt(currentPage)-1)}><i className="bi bi-chevron-left"></i></a>
                                        }
                                    </li>
                                    {pagination.map((pg, keyP)=>{
                                        return (
                                            <li className="page-item" key={keyP}>
                                                {currentPage == pg
                                                    ? <a className={`page-link border-radius-0 active`}>{pg}</a>
                                                    : <a className={`page-link border-radius-0`} onClick={()=>handlePageChange(pg)}>{pg}</a>
                                                }
                                            </li>
                                        )
                                    })}
                                    <li className={`page-item ${(currentPage == pagination.length) ? 'disabled' : ''}`}>
                                        {currentPage == pagination.length
                                            ? <a className="page-link border-radius-0" tabIndex="-1" aria-disabled="true"><i className="bi bi-chevron-right"></i></a>
                                            : <a className="page-link border-radius-0" onClick={()=>handlePageChange(parseInt(currentPage)+1)}><i className="bi bi-chevron-right"></i></a>
                                        }
                                    </li>
                                </ul>
                            </nav>
                        </>
                    }
                </>
            }
        </LayoutFo>
    );
}
  
export default InfoList;