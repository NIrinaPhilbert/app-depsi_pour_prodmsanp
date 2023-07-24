import React, {useState, useEffect, useRef} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react';

function EventEdit() {
    const [id, setId] = useState(useParams().id)
    const [title, setTitle] = useState('')
    const [begin, setBegin] = useState('')
    const [end, setEnd] = useState('')
    const [shortDescription, setShortDescription] = useState('')
    const [longDescription, setLongDescription] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneralError, setIsGeneralError] = useState(false)
    const [msgGeneral, setMsgGeneral] = useState('')
    const [isFetched, setIsFetched] = useState(false)
    const navigate = useNavigate()
    const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches
    const shortContentRef = useRef(null)
    const longContentRef = useRef(null)

    useEffect(() => {
        setIsGeneralError(false)
        setMsgGeneral("")
        setIsSaving(true)
        showLoader()
        axios.get(`/api/events/${id}`)
        .then(function (response) {
            let event = response.data
            setTitle(event.title)
            setBegin(new Date(event.begin))
            setEnd(new Date(event.end))
            setShortDescription(event.short_description)
            setLongDescription(event.long_description)
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
            navigate("/admin/events")
        })
    }, [])
  
    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            title == '' 
            || begin == '' 
            || end == ''
        ) {
            setIsGeneralError(true)
            if (end == '') setMsgGeneral("Le champ \"Date fin\" est requis.")
            if (begin == '') setMsgGeneral("Le champ \"Date Début\" est requis.")
            if (title == '') setMsgGeneral("Le champ \"Titre\" est requis.")
            setIsSaving(false)
            hideLoader()
        } else {
            setIsGeneralError(false)
            setMsgGeneral("")
            let formData = new FormData()
            formData.append("action", "modify")
            formData.append("title", title)
            formData.append("begin", formatDateTime(begin))
            formData.append("end", formatDateTime(end))
            formData.append("short_description", shortContentRef.current.getContent())
            formData.append("long_description", longContentRef.current.getContent())
            axios.post(`/api/events/edit/${id}`, formData)
                .then(function (response) {
                    hideLoader()
                    toast.success("Evènement modifié avec succès.", {
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
                    setBegin('')
                    setEnd('')
                    setShortDescription('')
                    setLongDescription('')
                    navigate("/admin/events")
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
                    navigate('/admin/events')
                });
        }
    }

    const formatDateTime = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = '' + d.getHours(),
            minute = '' + d.getMinutes(),
            second = '' + d.getSeconds();

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if (minute.length < 2) minute = '0' + minute;
        if (second.length < 2) second = '0' + second;

        var daty = [year, month, day].join('-');
        var lera = [hour, minute, second].join(':');
        return [daty, lera].join(' ')
    }
  
    return (
        <Layout>
            <div className="pagetitle">
                <h1>Evènements</h1>
                <nav className="mt-2">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/home">DEPSI</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/events">Evènements</Link></li>
                        <li className="breadcrumb-item active">Mise à jour</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-3">
                            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                                <div className="card-body p-3">
                                    <div className="mt-2 mb-4"><h4>Modifier un évènement</h4></div>
                                    <hr className="mt-2 mb-4"/>
                                    {!isFetched ? <div className="text-center text-sm p-0 pb-3"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                                        :
                                        <>
                                            <div className="w-100 mb-4">
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
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="form-floating form-floating-datepicker form-date-left mx-4 mb-3">
                                                            <DatePicker
                                                                className="form-control border border-outline-primary"
                                                                selected={begin}
                                                                onChange={(value)=>{setBegin(value)}}
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                timeCaption="time"
                                                                dateFormat="dd/MM/yyyy HH:mm"
                                                                id="begin"
                                                                name="begin"
                                                                selectsStart
                                                                startDate={begin}
                                                                endDate={end}
                                                                shouldCloseOnSelect={false}
                                                                placeholder="Date début"
                                                            />
                                                            <label htmlFor="date">Date début <span className="text-bold text-danger text-sm">*</span></label>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="form-floating form-floating-datepicker form-date-right mx-4 mb-3">
                                                            <DatePicker
                                                                className="form-control border border-outline-primary"
                                                                selected={end}
                                                                onChange={(value)=>{setEnd(value)}}
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                timeCaption="time"
                                                                dateFormat="dd/MM/yyyy HH:mm"
                                                                id="end"
                                                                name="end"
                                                                selectsEnd
                                                                startDate={begin}
                                                                endDate={end}
                                                                minDate={begin}
                                                                shouldCloseOnSelect={false}
                                                                placeholder="Date fin"
                                                            />
                                                            <label htmlFor="date">Date fin <span className="text-bold text-danger text-sm">*</span></label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group mx-4 mb-3">
                                                    <label className="form-label">Courte description</label>
                                                    <Editor
                                                        onInit={(evt, editor) => shortContentRef.current = editor}
                                                        initialValue={shortDescription}
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
                                                <div className="form-group mx-4 mb-3">
                                                    <label className="form-label">Longue description</label>
                                                    <Editor
                                                        onInit={(evt, editor) => longContentRef.current = editor}
                                                        initialValue={longDescription}
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
                                                to="/admin/events"
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
  
export default EventEdit;