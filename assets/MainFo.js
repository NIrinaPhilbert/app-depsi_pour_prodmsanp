import React from 'react';
import ReactDOM from 'react-dom';
//import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/fo/home/home"
import HomeDetails from "./pages/fo/home/HomeDetails"
import EventShow from "./pages/fo/event/EventShow"
import DocumentaryList from "./pages/fo/documentary/DocumentaryList"
import DocumentaryToList from "./pages/fo/documentary/DocumentaryToList"
import DocumentaryShow from "./pages/fo/documentary/DocumentaryShow"
import AboutShow from "./pages/fo/about/AboutShow"
import AboutmohShow from "./pages/fo/about/AboutmohShow"
import OrganigrammeDepsi from "./pages/fo/about/OrganigrammeDepsi"
import InfoList from "./pages/fo/info/InfoList"
import Feedback from "./pages/fo/feedback/Feedback"

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MainFo() {
    return (
    	<>
	        <Router>
	            <Routes>
	                <Route exact path="/" element={<Home/>} />
	                <Route path="/details/:id" element={<HomeDetails/>} />
	                <Route path="/events/:id" element={<EventShow/>} />
	                <Route path="/tolistdocs" element={<DocumentaryToList/>} />
	                <Route path="/documentaryresources" element={<DocumentaryList/>} />
	                <Route path="/documentaryresources/:id" element={<DocumentaryShow/>} />
	                <Route path="/about" element={<AboutShow/>} />
					<Route path="/aboutmoh" element={<AboutmohShow/>} />
					<Route path="/organigrammedepsi" element={<OrganigrammeDepsi/>} />
	                <Route path="/infos" element={<InfoList/>} />
	                <Route path="/feedback" element={<Feedback/>} />
	            </Routes>
	        </Router>
	        <ToastContainer style={{ zIndex: 9999999 }} />
        </>
    );
}
   
export default MainFo;
   
if (document.getElementById('app-fo')) {
    //ReactDOM.render(<MainFo />, document.getElementById('app-fo'));
	ReactDOM.render(<MainFo />, document.getElementById('app-fo'));
	//createRoot(document.getElementById('app-fo')).render(<MainFo />)
}