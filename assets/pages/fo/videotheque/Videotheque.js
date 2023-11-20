import React,{ useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
 
function Videotheque() {
    const [videoList, setVideoList] = useState(["init"])
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState([])
    const [isFetched, setIsFetched] = useState(true)

	useEffect(() => {
        fetchVideosList(currentPage, false)
    }, [])

    const fetchVideosList = (pageNumber, isVIdeoFetched) => {
        setIsFetched(!isVIdeoFetched)
        showLoader()
        axios.get(`/api/videotheques_fo/${pageNumber}`)
        .then(async function (response) {
            setIsFetched(true)
            setVideoList(response.data.videos.length > 0 ? await response.data.videos : [])
            var paginate = []
            for (var i = 1; i <= response.data.pagination.total; i++) {
                paginate.push(i)
            }
            setPagination(paginate)
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
        fetchVideosList(pageNumber, true);
        setCurrentPage(pageNumber)
    }

    return (
        <LayoutFo>
            {!isFetched ? <div className="text-center text-sm p-0 pb-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    {(videoList.length > 0 && videoList[0] != 'init') &&
                        <>
                            <nav className="mb-3" aria-label="Page navigation">
                                <ul className="pagination justify-content-end">
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
                    <div className="row mb-2">
                        {(videoList.length == 0 && isFetched) &&
                            <>
                                <div className="col-12">
                                    <div className="alert alert-info text-center border-radius-0 mb-0">
                                        <i className="bi bi-info-circle-fill me-2"></i>
                                        Aucune vidéothèque trouvée.
                                    </div>
                                </div>
                            </>
                        }
                        {(videoList.length > 0 && isFetched && videoList[0] != 'init') &&
                            <>
                                {videoList.map((video, key)=>{
                                    return (
                                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-4" key={key}>
                                            <Link to={`/videotheques/details/${video.id}`}>
                                                <div className="card border-radius-0 border-none shadow" style={{height: "250px", backgroundImage: "url('"+video.coverFile+"')", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
                                                    <div className="card-body">
                                                        <h5 className="card-title text-white position-absolute" style={{fontWeight: "bold", bottom: ".5em"}} >{parse(video.title)}</h5>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </>
                        }
                    </div>
                    {(videoList.length > 0 && videoList[0] != 'init') &&
                        <>
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-end">
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
  
export default Videotheque;