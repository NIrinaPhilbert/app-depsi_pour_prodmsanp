import React, {useState, useEffect, useRef} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react';

var figureStatus = process.env.KEYFIGURE_STATUS
figureStatus = figureStatus.split('|')
var formattedFigureStatus = []
for (var i = 0; i < figureStatus.length; i++) {
    formattedFigureStatus[i] = {
        'labelKey': figureStatus[i],
        'value': figureStatus[i],
        'isSelected': (i == 0) ? true : false
    }
}
var statutOptions = formattedFigureStatus

var figureOptions = process.env.KEYFIGURE_OPTIONS
figureOptions = figureOptions.split('|')
var formattedFigureOptions = []
for (var i = 0; i < figureOptions.length; i++) {
    formattedFigureOptions[i] = {
        'labelKey': figureOptions[i],
        'value': figureOptions[i],
        'isSelected': (i == 0) ? true : false
    }
}
var kOptions = formattedFigureOptions

var figureTypes = process.env.KEYFIGURE_TYPES
figureTypes = figureTypes.split('|')

const acceptFileExtension = ".xls,.xlsx"
const acceptFileFormat = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

function KeyFigureEdit() {
    const initialFigureData = {
        title: "",
        type: "bar-vertical"
    }

    const initialXData = [""]
    const initialYData = [
        {
            label: "",
            data: [0]
        }
    ]

    const [id, setId] = useState(useParams().id)
    const [title, setTitle] = useState('')
    const [statut, setStatut] = useState('Actif')
    const [koption, setKoption] = useState(['Graphe'])
    const [dataAxis, setDataAxis] = useState(initialFigureData)
    const [theX, setTheX] = useState(initialXData)
    const [theY, setTheY] = useState(initialYData)
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()
    const [codeContent, setCodeContent] = useState('')
    const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches
    const codeContentRef = useRef(null)

    useEffect(() => {
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/key_figure/${id}`)
        .then(function (response) {
            let figure = response.data
            for (var i = 0; i < statutOptions.length; i++) {
                statutOptions[i].isSelected = (statutOptions[i].value == figure.statut) ? true : false
            }
            for (var i = 0; i < kOptions.length; i++) {
                kOptions[i].isSelected = (kOptions[i].value == figure.koption) ? true : false
            }
            setTitle(figure.title)
            setStatut(figure.statut)
            setKoption(figure.koption)
            setCodeContent(figure.codeContent)
            var figureData = JSON.parse(figure.axis)
            setDataAxis({
                title: figureData.title,
                type: figureData.type
            })
            setTheX(figureData.x)
            setTheY(figureData.y)
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
            navigate("/admin/keyfigures")
        })
    }, [])
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            title == '' 
            || statut == '' 
            || koption == ''
        ) {
            setIsGeneralError(true)
            if (statut == '') setMsgGeneral("Le champ \"Statut\" est requis.")
            if (koption == '') setMsgGeneral("Le champ \"Option\" est requis.")
            if (title == '') setMsgGeneral("Le champ \"Titre\" est requis.")
            setIsSaving(false)
            hideLoader()
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            var axis_data = JSON.stringify({
                title: dataAxis.title,
                type: dataAxis.type,
                x: theX,
                y: theY
            })
            let formData = new FormData()
            formData.append("action", "modify")
            formData.append("title", title)
            formData.append("statut", statut)
            formData.append("koption", koption)
            formData.append("data_axis", axis_data)
            formData.append("codeContent", codeContentRef.current.getContent())
            axios.post(`/api/key_figure/edit/${id}`, formData)
                .then(function (response) {
                    hideLoader()
                    toast.success("Figure modifiée avec succès.", {
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
                    setTitle('')
                    setStatut(['Actif'])
                    setKoption(['Graphe'])
                    navigate("/admin/keyfigures")
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
                    navigate('/admin/keyfigures')
                });
        }
    }

    const changeStatut = (selectedOptions) => {
        setStatut(selectedOptions.selectedKey)
    }

    const changeKoption = (selectedOptions) => {
        setKoption(selectedOptions.selectedKey)
    }

    const changeTitleData = (value) => {
        dataAxis.title = value
        var tTitle = {...dataAxis}
        setDataAxis(tTitle)
    }

    const changeTypeData = (type) => {
        $('.figure-type').removeClass('choosen')
        $('.'+type).addClass('choosen')
        dataAxis.type = type
        setDataAxis(dataAxis)
    }

    const addXData = () => {
        theX.push("")
        var tx = [...theX]
        setTheX(tx)
        for (var i = 0; i < theY.length; i++) {
            theY[i].data.push(0)
        }
        var tyInX = [...theY]
        setTheY(tyInX)
    }

    const changeXData = (keyA, value) => {
        theX[keyA] = value
        var txc = [...theX]
        setTheX(txc)
    }

    const closeX = (keyB) => {
        if (keyB !== -1) theX.splice(keyB, 1)
        var txclose = [...theX]
        setTheX(txclose)
        for (var i = 0; i < theY.length; i++) {
            theY[i].data.splice(keyB, 1)
        }
        var tyXclose = [...theY]
        setTheY(tyXclose)
    }

    const addYData = () => {
        theY.push({label: "", data: []})
        for (var i = 0; i < theX.length; i++) {
            for (var j = 0; j < theY.length; j++) {
                theY[j].data[i] = (parseInt(theY.length)-1 == j) ? 0 : theY[j].data[i]
            }
        }
        var ty = [...theY]
        setTheY(ty)
    }

    const changeYNameData = (keyC, value) => {
        theY[keyC].label = value
        var tyc = [...theY]
        setTheY(tyc)
    }

    const changeYData = (keyY, keyYdata, value) => {
        theY[keyY].data[keyYdata] = value
        var tydatac = [...theY]
        setTheY(tydatac)
    }

    const closeY = (keyD) => {
        if (keyD !== -1) theY.splice(keyD, 1)
        var tyx = [...theY]
        setTheY(tyx)
    }

    const importFileData = () => {
        document.querySelector('#fileToImport').click();
    }

    const onFileChange = (e) => {
        var thisFile = e.target.files[0]
        if (!acceptFileFormat.includes(thisFile.type)) {
            goToTop(0, 0)
            setIsGeneralError(true)
            setMsgGeneral("Type de fichier invalide. Choisissez entre : "+acceptFileExtension)
            document.querySelector("#fileToImport").value = ''
        } else {
            showLoader()
            setIsGeneralError(false)
            setMsgGeneral("")
            const reader = new FileReader()
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result)
                const optionsXlsx = {
                    type: 'array'
                }
                const workbook = XLSX.read(data, optionsXlsx)
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const result = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
                // Données : titre de la figure
                dataAxis.title = sheetName
                var tTitle = {...dataAxis}
                setDataAxis(tTitle)
                // /.Données : titre de la figure
                var dataX = []
                var dataY = []
                for (var i = 0; i < result.length; i++) {
                    var dataYtemp = []
                    // Données : data X
                    if (i == 0) {
                        for (var j = 0; j < result[i].length; j++) {
                            if (j > 0) dataX.push(result[i][j] != '' ? result[i][j] : 0)
                            if (j == (result[i].length-1)) break
                        }
                    }
                    // /.Données : data X
                    // Données : data Y
                    else {
                        for (var k = 0; k < result[i].length; k++) {
                            var yLabel = result[i][0]
                            if (k > 0) dataYtemp.push(result[i][k] != '' ? result[i][k] : 0)
                            if (k == (result[i].length-1)) {
                                dataY.push({
                                    "label": yLabel,
                                    "data": dataYtemp
                                })
                                break
                            }
                        }
                    }
                    // /.Données : data Y
                }
                setTheX(dataX)
                setTheY(dataY)
                hideLoader()
            };
            reader.readAsArrayBuffer(thisFile);
        }
    }

    return (
        <Layout>
            <div className="pagetitle">
                <h1>Chiffres clés</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/keyfigures">Chiffres clés</Link></li>
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
                                    <div className="mt-2 mb-4"><h4>Modifier une figure</h4></div>
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
                                                    <BootstrapSelect
                                                        id="statut"
                                                        options={statutOptions}
                                                        placeholder={"Choisissez un statut"}
                                                        className="form-control border border-outline-primary bg-white"
                                                        onChange={changeStatut} />
                                                    <label htmlFor="statut">Statut <span className="text-bold text-danger text-sm">*</span></label>
                                                </div>
                                                <div className="form-floating mx-4 mb-3">
                                                    <BootstrapSelect
                                                        id="koption"
                                                        options={kOptions}
                                                        placeholder={"Choisissez une option"}
                                                        className="form-control border border-outline-primary bg-white"
                                                        onChange={changeKoption} />
                                                    <label htmlFor="koption">Option <span className="text-bold text-danger text-sm">*</span></label>
                                                </div>
                                            </div>
                                            <hr className="mt-5 mb-4"/>
                                            <div className="w-100 mb-4">
                                                <h5 className="text-muted mx-4 mb-3">Données de la figure
                                                    {koption[0] == 'Graphe' &&
                                                        <>
                                                            <button 
                                                                onClick={(e) => {e.preventDefault(); importFileData();}}
                                                                className="btn btn-sm btn-outline-primary ms-3">
                                                                <i className="bi bi-upload me-1"></i> 
                                                                Importer (.xls/.xlsx)
                                                            </button>
                                                            <input 
                                                                onChange={(event)=>{onFileChange(event)}}
                                                                type="file"
                                                                accept={acceptFileExtension}
                                                                className="form-control border border-outline-primary"
                                                                id="fileToImport"
                                                                name="fileToImport"
                                                                hidden
                                                            />
                                                        </>
                                                    }
                                                </h5>
                                                <div className="form-floating mx-4 mb-3">
                                                    <input 
                                                        value={dataAxis.title}
                                                        onChange={e => changeTitleData(e.target.value)}
                                                        type="text"
                                                        className="form-control border border-outline-primary"
                                                        id="axisTitle"
                                                        name="axisTitle"
                                                        placeholder="Titre"/>
                                                    <label htmlFor="axisTitle">Titre de la figure <span className="text-bold text-danger text-sm">*</span></label>
                                                </div>
                                                {koption[0] == 'Graphe' &&
                                                    <>
                                                        <div className="mx-4 mb-4">
                                                            <label>Type de figure <span className="text-bold text-danger text-sm">*</span></label>
                                                            <div className="row mt-3 mx-1">
                                                                {figureTypes.map((type, key)=>{
                                                                    return (
                                                                        <div className={`figure-type ${type} col-4 p-3 ${(type == dataAxis.type) ? 'choosen' : ''}`} onClick={e => {e.preventDefault(); changeTypeData(type);}} key={key}>
                                                                            <i className={`bi bi-check2-circle text-success`}></i>
                                                                            <img className="w-100 h-auto" src={`/resources/img/charts/${type}-chart.png`} alt={type} />
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="mx-4 mb-4">
                                                            <label>Données X</label>
                                                            <div className="row mt-3 mx-1">
                                                                {theX.map((xd, xKey)=>{
                                                                    return (
                                                                        <div className={`figure-x form-floating col-2 m-1 ms-0 me-2 p-0`} key={`x${xKey}`}>
                                                                            {xKey > 0 &&
                                                                                <a onClick={(e) => closeX(xKey)} className="close-x text-danger">
                                                                                    <i className="bi bi-trash"></i>
                                                                                </a>
                                                                            }
                                                                            <input 
                                                                                value={xd}
                                                                                type="text"
                                                                                onChange={e => changeXData(xKey, e.target.value)}
                                                                                className="form-control border border-outline-primary"
                                                                                id={`xAxis-${xKey}`}
                                                                                name={`xAxis-${xKey}`}
                                                                                placeholder={`X ${xKey+1}`}/>
                                                                            <label htmlFor={`xAxis-${xKey}`} className="w-100">X {xKey+1}</label>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                            <button 
                                                                onClick={(e) => {e.preventDefault(); addXData();}}
                                                                className="btn btn-sm btn-outline-primary ms-1 mt-3">
                                                                <i className="bi bi-plus-circle me-1"></i> 
                                                                Ajouter
                                                            </button>
                                                        </div>
                                                        <div className="mx-4 mb-4">
                                                            <label>Données Y</label>
                                                            <div className="figures mt-3">
                                                                {theY.map((yd, yKey)=>{
                                                                    return (
                                                                        <div className="figure-item mb-3 p-3" key={`yd${yKey}`}>
                                                                            <h5 className="mt-0 mb-2 text-bold">{yKey+1}.
                                                                                {yKey > 0 &&
                                                                                    <a onClick={(e) => closeY(yKey)} className="float-end text-danger">
                                                                                        <i className="bi bi-trash"></i>
                                                                                    </a>
                                                                                }
                                                                            </h5>
                                                                            <div className={`figure-y form-floating`}>
                                                                                <input 
                                                                                    value={yd.label}
                                                                                    type="text"
                                                                                    onChange={e => changeYNameData(yKey, e.target.value)}
                                                                                    className="form-control border border-outline-primary"
                                                                                    id={`yNameAxis-${yKey}`}
                                                                                    name={`yNameAxis-${yKey}`}
                                                                                    placeholder={`Libelé`}/>
                                                                                <label htmlFor={`yNameAxis-${yKey}`}>Libelé</label>
                                                                            </div>
                                                                            <div className="row mt-2 mx-0">
                                                                                {yd.data.map((ydata, yDataKey)=>{
                                                                                    return (
                                                                                        <div className={`figure-y form-floating col-2 m-1 mt-2 ms-0 me-2 p-0`} key={`yData${yDataKey}`}>
                                                                                            <input 
                                                                                                value={ydata}
                                                                                                type="text"
                                                                                                onChange={e => changeYData(yKey, yDataKey, e.target.value)}
                                                                                                className="form-control border border-outline-primary"
                                                                                                id={`yDataAxis-${yDataKey}`}
                                                                                                name={`yDataAxis-${yDataKey}`}
                                                                                                placeholder={`Y ${yDataKey+1}`}/>
                                                                                            <label htmlFor={`yDataAxis-${yDataKey}`}>Y {yDataKey+1}</label>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                            <button 
                                                                onClick={(e) => {e.preventDefault(); addYData();}}
                                                                className="btn btn-sm btn-outline-primary mt-1">
                                                                <i className="bi bi-plus-circle me-1"></i> 
                                                                Ajouter
                                                            </button>
                                                        </div>
                                                    </>
                                                }
                                                {koption[0] == 'Code' &&
                                                    <>
                                                        <div className="form-group mx-4 mb-3">
                                                            <label className="form-label">Contenu</label>
                                                            <Editor
                                                                onInit={(evt, editor) => codeContentRef.current = editor}
                                                                initialValue={codeContent}
                                                                init={{
                                                                    language: 'fr_FR',
                                                                    height: 500,
                                                                    toolbar_sticky: true,
                                                                    toolbar_sticky_offset: isSmallScreen ? 102 : 108,
                                                                    menubar: 'file edit view insert format tools table help',
                                                                    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                                                                    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                                                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                }
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
                                                Enregistrer
                                            </button>
                                            <Link
                                                to="/admin/keyfigures"
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
  
export default KeyFigureEdit;