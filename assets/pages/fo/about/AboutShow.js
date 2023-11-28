import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import LayoutFo from "../../../components/LayoutFo"
import parse from 'html-react-parser'
import BootstrapSelect from 'react-bootstrap-select-dropdown'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

function dateRange(startDate, endDate) {
    var start      = startDate.split('-');
    var end        = endDate.split('-');
    var startYear  = parseInt(start[0]);
    var endYear    = parseInt(end[0]);
    var dates      = [];
  
    for(var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1])-1 : 0;
        for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
        var month = j+1;
        var displayMonth = month < 10 ? '0'+month : month;
        dates.push([i, displayMonth, '01'].join('-'));
        }
    }
    return dates;
}

function AboutShow() {
    const [textContent, setTextContent] = useState('')
    const [isFetched, setIsFetched] = useState(false)



    

    useEffect(() => {
        var toDateInterval = dateRange('2013-11-01', '2014-06-01') ;
        console.log(toDateInterval) ;
        return false ;
        showLoader()
        axios.get(`/api/about_fo/data`)
        .then(function (response) {
            let aboutData = response.data
            setTextContent(aboutData.textContent)
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
            navigate("/")
        })
    }, [])
  
    return (
        <LayoutFo>
            {!isFetched ? <div className="text-center text-sm p-0 pb-2"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                :
                <>
                    <div className="card shadow border-none border-radius-0">
                        <div className="card-body pre">
                            {parse(textContent)}
                        </div>
                        
                    </div>
                </>
            }
        </LayoutFo>
    );
}
  
export default AboutShow;