import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

let document_access_keys = process.env.DOCUMENT_ACCESS_KEYS
document_access_keys = document_access_keys.split('|')
let document_access_values = process.env.DOCUMENT_ACCESS_VALUES
document_access_values = document_access_values.split('|')
var formattedDocumentAccess = []
for (var i = 0; i < document_access_keys.length; i++) {
    formattedDocumentAccess[i] = {
        'labelKey': document_access_keys[i],
        'value': document_access_values[i],
        'isSelected': (i == 0) ? true : false
    }
}
const documentAccessOptions = formattedDocumentAccess

const acceptDocExtension = ".zip,.rar,.xls,.xlsx,.doc,.docx,.pdf"
const acceptDocFormat = [
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.rar',
    'application/rar',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
]
const acceptCoverExtension = ".jpg,.jpeg,.png"
const acceptCoverFormat = [
    'image/jpeg',
    'image/png'
]

function DocumentaryCreate() {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [date, setDate] = useState('')
    const [author, setAuthor] = useState('NA')
    const [posttype, setPosttype] = useState('')
    const [direction, setDirection] = useState('')
    const [directionOptions, setDirectionOptions] = useState([])
    const [posttypeOptions, setPosttypeOptions] = useState([])
    const [themes, setThemes] = useState('')
    const [themesOptions, setThemesOptions] = useState([])
    const [entitys, setEntitys] = useState('')
    const [entitysOptions, setEntitysOptions] = useState([])

    const [selectedDocs, setSelectedDocs] = useState([])
    const [docNames, setDocNames] = useState([])
    const [docFiles, setDocFiles] = useState([])
    const [coverName, setCoverName] = useState('')
    const [coverFile, setCoverFile] = useState({})
    const [documentAccess, setDocumentAccess] = useState(document_access_keys[0])
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        setDocumentAccess([document_access_keys[0]])
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/entitys/directionOptions`)
        .then(function (response) {
            setDirectionOptions(response.data)
            setIsSaving(false)
            hideLoader()
        })
        .catch(function (error) {
            toast.error('Une erreur option direction est survenue.', {
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
    }, [])

    useEffect(() => {
        setDocumentAccess([document_access_keys[0]])
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/posttypes/posttypeOptions`)
        .then(function (response) {
            setPosttypeOptions(response.data)
            setIsSaving(false)
            hideLoader()
        })
        .catch(function (error) {
            toast.error('Une erreur post type options est survenue.', {
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
    }, [])
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            title == '' 
            || date == '' 
            || author == '' 
            || posttype == '' 
            || direction == '' 
            || entitys == '' 
            || themes == '' 
            || areAllValuesEmpty(docNames) 
            || coverName == '' 
            || !acceptCoverFormat.includes(coverFile.type)
        ) {
            goToTop(0, 0)
            setIsGeneralError(true)
            if (coverName == '') {
                document.querySelector("#cover").value = ''
                setMsgGeneral("La photo de couverture est requise.")
            }
            else if (!acceptCoverFormat.includes(coverFile.type)) {
                document.querySelector("#cover").value = ''
                setMsgGeneral("Type de fichier invalide. Choisissez entre : "+acceptCoverExtension)
            }
            else if (areAllValuesEmpty(docNames)) {
                setMsgGeneral("Vérifiez vos documents.")
            }
            else if (title == '') setMsgGeneral("Le champ \"Titre\" est requis.")
            else if (date == '') setMsgGeneral("Le champ \"Date\" est requis.")
            else if (author == '') setMsgGeneral("Le champ \"Auteur\" est requis.")
            else if (posttype == '') setMsgGeneral("Le champ \"Type de publication\" est requis.")
            else if (direction == '') setMsgGeneral("Le champ \"Direction\" est requis.")
            else if (entitys == '') setMsgGeneral("Le champ \"Entité source\" est requis.")
            else if (themes == '') setMsgGeneral("Le champ \"Thématique\" est requis.")
            else setMsgGeneral("Une erreur quelconque est survenue.")
            setIsSaving(false)
            hideLoader()
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            let formData = new FormData()
            formData.append("action", "add")
            formData.append("coverFile", coverFile)
            formData.append("coverName", coverName)
            docFiles.forEach((docmnt) => {
                if (docmnt != null) formData.append('docFiles[]', docmnt);
            });
            docNames.forEach((docname) => {
                if (docname != '') formData.append('docNames[]', docname);
            });
            formData.append("documentAccess", documentAccess)
            formData.append("title", title)
            formData.append("date", formatDate(date))
            formData.append("author", author)
            formData.append("pub_type", posttype)
            formData.append("direction", direction)
            formData.append("entitys", entitys)
            formData.append("thematic", themes)
            formData.append("summary", summary)
            axios.post('/api/docs/create', formData)
                .then(function (response) {
                    hideLoader()
                    toast.success("Ressource ajoutée avec succès.", {
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
                    /*setCoverName('')
                    setCoverFile({})
                    setDocNames([])
                    setDocFiles([])
                    setDocumentAccess([document_access_keys[0]])
                    setTitle('')
                    setDate('')
                    setAuthor('')
                    setDirection('')
                    setPubtype('')
                    setEntitys('')
                    setThematic('')*/
                    navigate("/admin/documentaryresources")
                })
                .catch(function (error) {
                    toast.error('Une erreur ajout succes est survenue.', {
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
                    navigate('/admin/documentaryresources')
                });
        }
    }

    const isEmpty = (value) => {
        return value === null || value === undefined || value === ''
    }

    const areAllValuesEmpty = (myArray) => {
        return myArray.every(isEmpty)
    }

    const onCoverChange = (event) => {
        var thisFile = event.target.files[0]
        if (acceptCoverFormat.includes(thisFile.type) && thisFile) {
            setCoverFile(thisFile)
            setIsGeneralError(false)
            setMsgGeneral("")
            setCoverName(thisFile.name)
            const reader = new FileReader();
            reader.onloadend = () => {
                document.querySelector("#cover-img").setAttribute("src", reader.result);
            };
            reader.readAsDataURL(thisFile);
        } else {
            goToTop(0, 0)
            setCoverFile({})
            setIsGeneralError(true)
            setMsgGeneral("Type de fichier invalide. Choisissez entre : "+acceptCoverExtension)
            setCoverName("")
            document.querySelector("#cover").value = ''
            document.querySelector("#cover-img").setAttribute("src", coverName);
        }
    }

    const handleDocChange = (e, ind) => {
        var thisFile = e.target.files[0]
        if (!acceptDocFormat.includes(thisFile.type)) {
            goToTop(0, 0)
            setIsGeneralError(true)
            setMsgGeneral("Type de fichier invalide. Choisissez entre : "+acceptDocExtension)
            var theFiles = [...docFiles]
            theFiles[ind] = null
            var theNames = [...docNames]
            theNames[ind] = ""
            setDocFiles(theFiles);
            setDocNames(theNames);
            document.querySelector("#doc_"+ind).value = ''
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            var theFiles = [...docFiles]
            theFiles[ind] = thisFile
            var theNames = [...docNames]
            theNames[ind] = thisFile.name
            setDocFiles(theFiles);
            setDocNames(theNames);
        }
    };

    const handleAddDoc = () => {
        setSelectedDocs([...selectedDocs, null])
        setDocFiles([...docFiles, null])
        setDocNames([...docNames, ""])
    }

    const changeDocumentAccess = (selectedOptions) => {
        setDocumentAccess(selectedOptions.selectedKey)
    }

    const clearCover = () => {
        setCoverFile({})
        setCoverName('')
    }

    const deleteDoc = (ind) => {
        var files = [...docFiles]
        files.splice(ind, 1)
        setDocFiles(files)
        var names = [...docNames]
        names.splice(ind, 1)
        setDocNames(names)
        var selected = [...selectedDocs]
        selected.splice(ind, 1)
        setSelectedDocs(selected)
    }

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const focusDatepicker = (ev) => {
        var thisId = ev.target.id;
        $('#'+thisId).closest('.form-floating').addClass('form-floating-datepicker')
    }

    const blurDatepicker = (ev) => {
        var thisId = ev.target.id;
        if ($('#'+thisId).val() == '') $('#'+thisId).closest('.form-floating').removeClass('form-floating-datepicker')
    }

    const changeDirection = (selectedOptions) => {
        let directionSelected = selectedOptions.selectedKey
        setDirection(directionSelected)
        if (directionSelected != '') {
            setIsSaving(true)
            showLoader()
            axios.get(`/api/entitys/entitiesOptions/${directionSelected}`)
            .then(function (response) {
                setEntitysOptions(response.data)
                setIsSaving(false)
                hideLoader()
            })
            .catch(function (error) {
                toast.error('Une erreur liste entite est survenue.', {
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

    const changePosttype = (selectedOptions) => {
        let posttypeSelected = selectedOptions.selectedKey
        setPosttype(posttypeSelected)
        if (posttypeSelected != '') {
            setIsSaving(true)
            showLoader()
            axios.get(`/api/themes/themesOptions/${posttypeSelected}`)
            .then(function (response) {
                setThemesOptions(response.data)
                setIsSaving(false)
                hideLoader()
            })
            .catch(function (error) {
                toast.error('Une erreur liste theme est survenue.', {
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

    const changeThemes = (selectedOptions) => {
        setThemes(selectedOptions.selectedKey)
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Ressources documentaires</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/documentaryresources">Ressources documentaires</Link></li>
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
                                    <div className="mt-2 mb-4"><h4>Créer une nouvelle ressource</h4></div>
                                    <hr className="mt-2 mb-4"/>
                                    <div className="w-100 mb-4">
                                        {isGeneralError &&
                                            <div className="mx-4 mt-3 mb-3 alert alert-warning text-center form-error">
                                                <i className="fa fa-exclamation-triangle fa-fw mx-1"></i>
                                                {msgGeneral}
                                            </div>
                                        }
                                        <div className="form-group mx-4 mb-3">
                                            <label className="form-label" htmlFor="cover">Photo de couverture <span className="text-bold text-danger text-sm">*</span> ({acceptCoverExtension})</label>
                                            <input 
                                                onChange={(event)=>{onCoverChange(event)}}
                                                type="file"
                                                accept={acceptCoverExtension}
                                                className="form-control border border-outline-primary"
                                                id="cover"
                                                name="cover"
                                                hidden/>
                                            <p className="form-control border border-outline-primary p-0">
                                                <button className="btn btn-light" onClick={(event)=>{event.preventDefault(); document.querySelector('#cover').click();}}>Parcourir...</button>
                                                <label className="mx-3">
                                                    {coverName != ''
                                                        ? <>{coverName}</>
                                                        : 'Aucune photo sélectionnée.'
                                                    }
                                                </label>
                                                <a onClick={(event)=>{event.preventDefault(); clearCover()}} className="close-document text-dark float-end" style={{ display: (coverName != '') ? 'block' : 'none' }}><i className="bi bi-x-lg"></i></a>
                                            </p>
                                            {coverName != '' &&
                                                <img id="cover-img" src={coverFile} className="img-thumbnail w-50" />
                                            }
                                        </div>
                                        <div className="form-group mx-4">
                                            <label className="form-label mb-0" htmlFor="doc">Document(s) <span className="text-bold text-danger text-sm">*</span> ({acceptDocExtension})</label>
                                            {selectedDocs.map((file, index) => (
                                                <article key={index}>
                                                    <p className="form-control border border-outline-primary p-0 mt-3">
                                                        <input 
                                                            onChange={(event)=>{handleDocChange(event, index)}}
                                                            type="file"
                                                            accept={acceptDocExtension}
                                                            className="form-control border border-outline-primary"
                                                            id={`doc_${index}`}
                                                            name="doc[]"
                                                            hidden/>
                                                        <button className="btn btn-light" onClick={(event)=>{event.preventDefault(); document.querySelector(`#doc_${index}`).click();}}>Parcourir...</button>
                                                        <label className="mx-3">
                                                            {docNames[index] != ''
                                                                ? <><i className="bi bi-file-zip-fill me-1"></i>{docNames[index]}</>
                                                                : 'Aucun document sélectionné.'
                                                            }
                                                        </label>
                                                        <a onClick={(event)=>{event.preventDefault(); deleteDoc(index)}} className="close-document text-dark float-end"><i className="bi bi-trash"></i></a>
                                                    </p>
                                                </article>
                                            ))}
                                        </div>
                                        <div className="form-group mx-4 mb-4 mt-3">
                                            <button className="btn btn-sm btn-outline-primary" type="button" onClick={handleAddDoc}>
                                                <i className="bi bi-plus-circle me-1"></i>Nouveau document
                                            </button>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <BootstrapSelect
                                                id="document_access"
                                                options={documentAccessOptions}
                                                placeholder={"Choisissez un type d'accès"}
                                                className="form-control border border-outline-primary bg-white"
                                                onChange={changeDocumentAccess} />
                                            <label htmlFor="document_access">Type d'accès <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <input 
                                                onChange={(event)=>{setTitle(event.target.value)}}
                                                value={title}
                                                type="text"
                                                className="form-control border border-outline-primary"
                                                id="title"
                                                name="title"
                                                placeholder="Titre"/>
                                            <label htmlFor="title">Titre <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <DatePicker
                                                className="form-control border border-outline-primary"
                                                selected={date}
                                                onChange={(value)=>{setDate(value)}}
                                                onFocus={e => { e.preventDefault(); focusDatepicker(e); }}
                                                onBlur={e => { e.preventDefault(); blurDatepicker(e); }}
                                                dateFormat="dd/MM/yyyy"
                                                id="date"
                                                name="date"
                                                shouldCloseOnSelect={false}
                                                placeholder="Date"
                                            />
                                            <label htmlFor="date">Date <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <input 
                                                onChange={(event)=>{setAuthor(event.target.value)}}
                                                value={author}
                                                type="text"
                                                className="form-control border border-outline-primary"
                                                id="author"
                                                name="author"
                                                placeholder="Auteur"/>
                                            <label htmlFor="author">Auteur <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                                <BootstrapSelect
                                                id="posttype_id"
                                                options={posttypeOptions}
                                                placeholder={"Choisissez un type de publication"}
                                                className="form-control border border-outline-primary bg-white"
                                                onChange={changePosttype} />
                                                
                                            
                                                
                                            <label htmlFor="pubtype">Type de publication <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <BootstrapSelect
                                                id="themes"
                                                options={themesOptions}
                                                placeholder={"Choisissez une thématique"}
                                                className="form-control border border-outline-primary bg-white"
                                                onChange={changeThemes} />
                                            
                                            <label htmlFor="thematic">Thématique <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <BootstrapSelect
                                                id="direction"
                                                options={directionOptions}
                                                placeholder={"Choisissez une direction"}
                                                className="form-control border border-outline-primary bg-white"
                                                onChange={changeDirection} />
                                            <label htmlFor="direction">Direction <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <BootstrapSelect
                                                id="entitys"
                                                options={entitysOptions}
                                                placeholder={"Choisissez une entité source"}
                                                className="form-control border border-outline-primary bg-white"
                                                onChange={changeEntitys} />
                                            <label htmlFor="entitys">Entité source <span className="text-bold text-danger text-sm">*</span></label>
                                        </div>
                                        <div className="form-floating mx-4 mb-3">
                                            <textarea 
                                                onChange={(event)=>{setSummary(event.target.value)}}
                                                value={summary}
                                                className="form-control border border-outline-primary h-auto"
                                                id="summary"
                                                rows="8"
                                                name="summary"
                                                placeholder="Résumé"></textarea>
                                            <label htmlFor="summary">Résumé <span className="text-bold text-danger text-sm"></span></label>
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
                                            to="/admin/documentaryresources"
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
  
export default DocumentaryCreate;