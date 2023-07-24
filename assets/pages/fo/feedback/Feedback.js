import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

function Feedback() {
    const [comment, setComment] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(()=> {
        goToTop(document.querySelector('#hero').getBoundingClientRect().height - document.querySelector('#header').getBoundingClientRect().height, 0)
    }, [])

    const handleSave = () => {
        setIsSaving(true)
        showLoader()
        if (
            comment == ''
        ) {
            Swal.fire({
                text: 'Le commentaire est vide',
                icon: 'warning',
                showCancelButton: false,
                customClass: {
                    confirmButton: 'btn btn-md btn-outline-primary',
                },
                buttonsStyling: false,
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false,
                timer: 2000
            }).then((result) => {
                if (result.isConfirmed) {}
            })
            setIsSaving(false)
            hideLoader()
        } else {
            let formData = new FormData()
            formData.append("action", "add")
            formData.append("comment", comment)
            axios.post('/api/feedback_fo/create', formData)
                .then(function (response) {
                    hideLoader()
                    setComment('')
                    setIsSaving(false)
                    Swal.fire({
                        text: 'Commentaire envoyé avec succès.',
                        icon: 'success',
                        showConfirmButton: false,
                        showCancelButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        timer: 3000
                    }).then((result) => {
                        if (result.isConfirmed) {}
                    })
                })
                .catch(function (error) {
                    Swal.fire({
                        text: 'Une erreur est survenue',
                        icon: 'error',
                        showCancelButton: false,
                        customClass: {
                            confirmButton: 'btn btn-md btn-outline-primary',
                        },
                        buttonsStyling: false,
                        confirmButtonText: 'OK',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then((result) => {
                        if (result.isConfirmed) {}
                    })
                    setIsSaving(true)
                });
        }
    }
  
    return (
        <LayoutFo>
            <div className="card shadow border-none border-radius-0">
                <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <div className="card-body p-3">
                        <h4 className="w-100 mb-3">Feedback</h4>
                        <div className="alert alert-info fade show mb-3" role="alert">
                            <i className="bi bi-info-circle me-1"></i>
                            Vous pouvez nous envoyer des commentaires ou des idées
                        </div>
                        <div className="form-floating mb-3">
                            <textarea 
                                value={comment}
                                onChange={(event)=>{setComment(event.target.value)}}
                                className="form-control form-control-sm border-radius-0 h-auto"
                                id="comment"
                                rows="10"
                                name="comment"
                                placeholder="Ecrivez votre commentaire..."></textarea>
                            <label htmlFor="comment">Ecrivez votre commentaire...</label>
                        </div>
                    </div>
                    <div className="card-footer bg-white p-3">
                        <div className="w-100 text-center">
                            <button 
                                disabled={isSaving} 
                                type="submit"
                                className="btn btn-outline-primary border-radius-0 mx-1">
                                <i className="bi bi-save me-1"></i> 
                                Envoyer
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </LayoutFo>
    );
}
  
export default Feedback;