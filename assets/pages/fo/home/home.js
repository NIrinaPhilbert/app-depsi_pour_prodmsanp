import React,{ useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
 
function Home() {
    const [eventList, setEventList] = useState(["init"])
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const [isFiguresFetched, setIsFiguresFetched] = useState(false)
    const [figureList, setFigureList] = useState([])

	useEffect(() => {
        fetchEventsList(currentPage, false)
        fetchFiguresList()
    }, [])

    const fetchEventsList = (pageNumber, isEventFetched) => {
        //setIsFetched(!isEventFetched)
        setIsFetched(false)
        showLoader()
        //console.log('ici evenement') ;
        axios.get(`/api/events_fo/${pageNumber}`)
        .then(async function (response) {
            setIsFetched(true)
            setEventList(response.data.events.length > 0 ? await response.data.events : [])
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

    const fetchFiguresList = () => {
        setIsFiguresFetched(false)
        showLoader()
        axios.get(`/api/figures_fo/list`)
        .then(async function (response) {
            setIsFiguresFetched(true)
            setFigureList(await response.data.figures)
            await drawCharts(response.data.figures)
            if (response.data.figures.length > 0) {
                let heroChartCarouselIndicators = selectChart("#heroChart-carousel-indicators")
                let heroChartCarouselItems = selectChart('#heroChartCarousel .carousel-item', true)
                heroChartCarouselItems.forEach((itemChart, indexChart) => {
                    (indexChart === 0) ? heroChartCarouselIndicators.innerHTML += "<li data-bs-target='#heroChartCarousel' data-bs-slide-to='" + indexChart + "' class='active'></li>" : heroChartCarouselIndicators.innerHTML += "<li data-bs-target='#heroChartCarousel' data-bs-slide-to='" + indexChart + "'></li>"
                })
            }
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

    const drawCharts = (figuresData) => {
        for (var i = 0; i < figuresData.length; i++) {
            for (var j = 0; j < figuresData[i].length; j++) {
                if (figuresData[i][j].koption == 'Graphe') {
                    var dataAxis = JSON.parse(figuresData[i][j].axis)
                    var dataType = (dataAxis.type.includes('-vertical') || dataAxis.type.includes('-horizontal')) ? 'bar' : dataAxis.type
                    var isHorizontal = (dataAxis.type.includes('-horizontal')) ? true : false
                    var dataStroke = (dataAxis.type.includes('-vertical') || dataAxis.type.includes('-horizontal')) ? { show: true, width: 2, colors: ['transparent'] } : { curve: 'straight' }
                    for (var k = 0; k < dataAxis.y.length; k++) {
                        dataAxis.y[k].name = dataAxis.y[k].label
                        delete dataAxis.y[k].label
                    }

                    new ApexCharts(document.querySelector("#chart-"+i+"in"+j), {
                        series: dataAxis.y,
                        chart: {
                            type: dataType,
                            height: 350,
                            zoom: {
                                enabled: false
                            }
                        },
                        plotOptions: {
                            bar: {
                                horizontal: isHorizontal,
                                columnWidth: '55%',
                                endingShape: 'rounded'
                            },
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: dataStroke,
                        grid: {
                          row: {
                            opacity: 0.5
                          },
                        },
                        xaxis: {
                            categories: dataAxis.x,
                        },
                        fill: {
                            opacity: 1
                        }
                    }).render()
                }
            }
        }
    }

    const handlePageChange = (pageNumber) => {
        fetchEventsList(pageNumber, true);
        setCurrentPage(pageNumber)
    }

    const selectChart = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    return (
        <LayoutFo>
            {!isFetched ? <div className="text-center text-sm p-0 pb-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    {(eventList.length > 0 && eventList[0] != 'init') &&
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
                        {(eventList.length == 0 && isFetched) &&
                            <>
                                <div className="col-12">
                                    <div className="alert alert-info text-center border-radius-0 mb-0">
                                        <i className="bi bi-info-circle-fill me-2"></i>
                                        Aucun évènement trouvé.
                                    </div>
                                </div>
                            </>
                        }
                        {(eventList.length > 0 && isFetched && eventList[0] != 'init') &&
                            <>
                                {eventList.map((event, key)=>{
                                    return (
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 mb-4" key={key}>
                                            <div className="card border-radius-0 border-none shadow">
                                                <div className="card-body pre">
                                                    {parse(event.short_description)}
                                                    <Link to={`/events/${event.id}`} className="my-2 btn btn-primary border-radius-0">Voir plus</Link>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        }
                    </div>
                    {(eventList.length > 0 && eventList[0] != 'init') &&
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
            {!isFiguresFetched ? <div className={`text-center text-sm p-0 pb-2 ${eventList.length > 0 && eventList[0] != 'init' ? 'mt-5' : 'mt-3'}`}><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    {figureList.length > 0
                        ? <>
                            <section className="hero heroChart mt-5 shadow" id="heroChart">
                                <div id="heroChartCarousel" data-bs-interval="5000" className="carousel slide carousel-fade" data-bs-ride="carousel">
                                    <ol className="carousel-indicators" id="heroChart-carousel-indicators"></ol>
                                    <div className="carousel-inner" role="listbox">
                                        {figureList.map((figure, keyF)=>{
                                            return (
                                                <div className={`carousel-item ${keyF == 0 ? 'active' : ''}`} key={`figure${keyF}`}>
                                                    <div className="carousel-container">
                                                        <div className="row w-100 mb-5">
                                                            {figure.map((figureInner, keyFInner)=>{
                                                                var dataAxisInner = JSON.parse(figureInner.axis)
                                                                return (
                                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" key={`figureInner${keyF}${keyFInner}`}>
                                                                        <h3 className="text-left animate__animated animate__fadeInDown">{dataAxisInner.title}</h3>
                                                                        {figureInner.koption == 'Graphe' && <div className="w-100 animate__animated animate__fadeInUp" id={`chart-${keyF}in${keyFInner}`}></div>}
                                                                        {figureInner.koption == 'Code' && <div className="w-100 mt-3 animate__animated animate__fadeInUp">{parse(figureInner.codeContent)}</div>}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <a className="carousel-control-prev ms-2" href="#heroChartCarousel" role="button" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
                                    </a>
                                    <a className="carousel-control-next me-2" href="#heroChartCarousel" role="button" data-bs-slide="next">
                                        <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
                                    </a>
                                </div>
                            </section>
                        </>
                        : <div className="row mt-5 mb-2">
                            <div className="col-12">
                                <div className="alert alert-info text-center border-radius-0 mb-0">
                                    <i className="bi bi-info-circle-fill me-2"></i>
                                    Aucune figure trouvée.
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </LayoutFo>
    );
}
  
export default Home;