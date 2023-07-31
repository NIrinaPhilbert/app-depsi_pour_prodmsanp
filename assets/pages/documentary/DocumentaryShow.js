import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

let document_access_keys = process.env.DOCUMENT_ACCESS_KEYS
document_access_keys = document_access_keys.split('|')

function DocumentaryShow() {
    const id = useParams().id
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [date, setDate] = useState('')
    const [author, setAuthor] = useState('')
    const [pubtype, setPubtype] = useState('')
    const [direction, setDirection] = useState('')
    const [directionOptions, setDirectionOptions] = useState([])
    const [entitys, setEntitys] = useState('')
    const [entitysOptions, setEntitysOptions] = useState([])
    const [thematic, setThematic] = useState('')
    const [coverName, setCoverName] = useState('')
    const [coverFile, setCoverFile] = useState({})
    const [docIcons, setDocIcons] = useState([])
    const [docNames, setDocNames] = useState([])
    const [docFiles, setDocFiles] = useState([])
    const [docSizes, setDocSizes] = useState([])
    const [documentAccessOptions, setDocumentAccessOptions] = useState([])
    const [documentAccess, setDocumentAccess] = useState(document_access_keys[0])
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        showLoader()
        axios.get(`/api/docs/${id}`)
        .then(function (response) {
            let doc = response.data
            setTitle(doc.title)
            setSummary(doc.summary)
            setDate(new Date(doc.date))
            setAuthor(doc.author)
            setDirection(doc.direction)
            setDirectionOptions(doc.directionOptions)
            setPubtype(doc.pub_type)
            setEntitys(doc.entities)
            setThematic(doc.thematic)
            setCoverName(doc.coverName)
            setCoverFile(doc.coverFile)
            setDocIcons(doc.docIcons)
            setDocNames(doc.docNames)
            setDocFiles(doc.docFiles)
            setDocSizes(doc.docSizes)
            setDocumentAccessOptions(doc.documentAccessOptions)
            setDocumentAccess([doc.documentAccess])
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
            navigate("/admin/documentaryresources")
        })
    }, [id])

    const changeDirection = (selectedOptions) => {
        let directionSelected = selectedOptions.selectedKey
        setDirection(directionSelected)
        if (directionSelected != '') {
            showLoader()
            axios.get(`/api/entitys/entitiesOptions/${directionSelected}`)
            .then(function (response) {
                setEntitysOptions(response.data)
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
                navigate("/admin/documentaryresources")
            })
        }
    }

    const changeEntitys = (selectedOptions) => {
        setEntitys(selectedOptions.selectedKey)
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Ressources documentaires</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/documentaryresources">Ressources documentaires</Link></li>
                        <li className="breadcrumb-item active">Détails</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-3">
                            <div className="card-body p-3">
                                <div className="mt-2 mb-4">
                                    <h4>Détails d'une ressource</h4>
                                </div>
                                <hr className="mt-2 mb-4"/>
                                {!isFetched ? <div className="text-center text-sm p-0 pb-3"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                                    :
                                    <>
                                        <div className="w-100 mb-4">
                                            {coverName != '' &&
                                                <div className="mx-4 mb-3">
                                                    <label className="w-100 mb-2" htmlFor="cover-img">Photo de couverture <span className="text-bold text-danger text-sm">*</span></label>
                                                    <img id="cover-img" src={coverFile} className="img-thumbnail w-50 mb-2" />
                                                </div>
                                            }
                                            {docNames != '' &&
                                                <div className="row mx-4 mb-4">
                                                    <label className="form-label" htmlFor="doc">Document(s)</label>
                                                    {docFiles.map((dfile, keyfile)=>{
                                                        return (
                                                            <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6" key={keyfile}>
                                                                <div className="card">
                                                                    <div className="text-center mt-3">
                                                                        <img src={docIcons[keyfile]} style={{"width": "75px"}} className="card-img-top" alt="icon" />
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <h6 className="card-title document-title fs-6">{docNames[keyfile]}</h6>
                                                                        <p className="card-text text-center mt-4">
                                                                            <a
                                                                                href={dfile}
                                                                                target="blank"
                                                                                className="btn btn-sm btn-outline-primary border-radius-0">
                                                                                <i className="bi bi-download me-1"></i>
                                                                                Télécharger
                                                                            </a>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            }
                                            <div className="form-floating mx-4 mb-3">
                                                <BootstrapSelect
                                                    id="document_access"
                                                    options={documentAccessOptions}
                                                    placeholder={"Choisissez un type d'accès"}
                                                    className="form-control border border-outline-primary bg-white"
                                                    disabled={true} />
                                                <label htmlFor="document_access">Type d'accès <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating mx-4 mb-3">
                                                <input 
                                                    onChange={(event)=>{setTitle(event.target.value)}}
                                                    value={title}
                                                    type="text"
                                                    className="form-control border border-outline-primary bg-white"
                                                    id="title"
                                                    name="title"
                                                    placeholder="Titre"
                                                    disabled={true}/>
                                                <label htmlFor="title">Titre <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating form-floating-datepicker mx-4 mb-3">
                                                <DatePicker
                                                    className="form-control border border-outline-primary bg-white"
                                                    selected={date}
                                                    onChange={(value)=>{setDate(value)}}
                                                    dateFormat="dd/MM/yyyy"
                                                    id="date"
                                                    name="date"
                                                    shouldCloseOnSelect={false}
                                                    placeholder="Date"
                                                    disabled={true}
                                                />
                                                <label htmlFor="date">Date <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating mx-4 mb-3">
                                                <input 
                                                    onChange={(event)=>{setAuthor(event.target.value)}}
                                                    value={author}
                                                    type="text"
                                                    className="form-control border border-outline-primary bg-white"
                                                    id="author"
                                                    name="author"
                                                    placeholder="Auteur"
                                                    disabled={true}/>
                                                <label htmlFor="author">Auteur <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating mx-4 mb-3">
                                                <input 
                                                    onChange={(event)=>{setPubtype(event.target.value)}}
                                                    value={pubtype}
                                                    type="text"
                                                    className="form-control border border-outline-primary bg-white"
                                                    id="pubtype"
                                                    name="pubtype"
                                                    placeholder="Type de publication"
                                                    disabled={true}/>
                                                <label htmlFor="pubtype">Type de publication <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating mx-4 mb-3">
                                                <BootstrapSelect
                                                    id="direction"
                                                    options={directionOptions}
                                                    placeholder={"Choisissez une direction"}
                                                    className="form-control border border-outline-primary bg-white"
                                                    onChange={changeDirection}
                                                    disabled={true} />
                                                <label htmlFor="direction">Direction <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating mx-4 mb-3">
                                                <BootstrapSelect
                                                    id="entitys"
                                                    options={entitysOptions}
                                                    placeholder={"Choisissez une entité source"}
                                                    className="form-control border border-outline-primary bg-white"
                                                    onChange={changeEntitys}
                                                    disabled={true} />
                                                <label htmlFor="entitys">Entité source <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating mx-4 mb-3">
                                                <input 
                                                    onChange={(event)=>{setThematic(event.target.value)}}
                                                    value={thematic}
                                                    type="text"
                                                    className="form-control border border-outline-primary bg-white"
                                                    id="thematic"
                                                    name="thematic"
                                                    placeholder="Thématique"
                                                    disabled={true}/>
                                                <label htmlFor="thematic">Thématique <span className="text-bold text-danger text-sm">*</span></label>
                                            </div>
                                            <div className="form-floating mx-4 mb-3">
                                                <textarea 
                                                    onChange={(event)=>{setSummary(event.target.value)}}
                                                    value={summary}
                                                    className="form-control border border-outline-primary h-auto"
                                                    id="summary"
                                                    rows="8"
                                                    name="summary"
                                                    placeholder="Résumé"
                                                    disabled={true}></textarea>
                                                <label htmlFor="summary">Résumé <span className="text-bold text-danger text-sm"></span></label>
                                            </div>
                                            
                                        </div>
                                    </>
                                }
                            </div>
                            {isFetched &&
                                <div className="card-footer bg-white p-3">
                                    <div className="w-100 text-center">
                                        <Link
                                            className="btn btn-sm btn-outline-success mx-1"
                                            to={`/admin/documentaryresources/edit/${id}`}>
                                            <i className="bi bi-pencil-square me-1"></i>
                                            Modifier
                                        </Link>
                                        <Link
                                            to="/admin/documentaryresources"
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
  
export default DocumentaryShow;