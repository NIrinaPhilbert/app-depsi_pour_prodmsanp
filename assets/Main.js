import React from 'react';
import ReactDOM from 'react-dom';
//maj
import { createRoot } from 'react-dom/client'
//fin maj
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Home
import Home from "./pages/home/Home"
import HomeCreate from "./pages/home/HomeCreate"
import HomeEdit from "./pages/home/HomeEdit"
// Users
import UserList from "./pages/user/UserList"
import UserCreate from "./pages/user/UserCreate"
import UserEdit from "./pages/user/UserEdit"
import UserShow from "./pages/user/UserShow"
// Events
import EventList from "./pages/event/EventList"
import EventCreate from "./pages/event/EventCreate"
import EventEdit from "./pages/event/EventEdit"
// Key figures
import KeyFigureList from "./pages/keyfigure/KeyFigureList"
import KeyFigureCreate from "./pages/keyfigure/KeyFigureCreate"
import KeyFigureEdit from "./pages/keyfigure/KeyFigureEdit"
// Directions
import DirectionList from "./pages/direction/DirectionList"
import DirectionCreate from "./pages/direction/DirectionCreate"
import DirectionEdit from "./pages/direction/DirectionEdit"
// Entities
import EntitiesList from "./pages/entities/EntitiesList"
import EntitiesCreate from "./pages/entities/EntitiesCreate"
import EntitiesEdit from "./pages/entities/EntitiesEdit"
// Documentary Resources
import DocumentaryList from "./pages/documentary/DocumentaryList"
import DocumentaryCreate from "./pages/documentary/DocumentaryCreate"
import DocumentaryEdit from "./pages/documentary/DocumentaryEdit"
import DocumentaryShow from "./pages/documentary/DocumentaryShow"
// Post Types ==> Type publication
import PostTypeList from "./pages/posttype/PostTypeList"
import PostTypeCreate from "./pages/posttype/PostTypeCreate"
import PostTypeEdit from "./pages/posttype/PostTypeEdit"
// Themes
import ThemeList from "./pages/theme/ThemeList"
import ThemeCreate from "./pages/theme/ThemeCreate"
import ThemeEdit from "./pages/theme/ThemeEdit"

// Infos
import InfoList from "./pages/info/InfoList"
import InfoCreate from "./pages/info/InfoCreate"
import InfoEdit from "./pages/info/InfoEdit"
// Visitors
import VisitorList from "./pages/visitor/VisitorList"
// About
import About from "./pages/about/About"
// About
import AboutMOH from "./pages/about/AboutMOH"

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
   
function Main() {
    return (
    	<>
	        <Router>
	            <Routes>
	                <Route exact path="/admin/home" element={<Home/>} />
	                <Route path="/admin/home/new" element={<HomeCreate/>} />
	                <Route path="/admin/home/edit/:id" element={<HomeEdit/>} />
	                <Route path="/admin/users" element={<UserList/>} />
	                <Route path="/admin/users/new" element={<UserCreate/>} />
	                <Route path="/admin/users/edit/:id" element={<UserEdit/>} />
	                <Route path="/admin/users/show/:id" element={<UserShow/>} />
	                <Route path="/admin/events" element={<EventList/>} />
	                <Route path="/admin/events/new" element={<EventCreate/>} />
	                <Route path="/admin/events/edit/:id" element={<EventEdit/>} />
	                <Route path="/admin/keyfigures" element={<KeyFigureList/>} />
	                <Route path="/admin/keyfigures/new" element={<KeyFigureCreate/>} />
	                <Route path="/admin/keyfigures/edit/:id" element={<KeyFigureEdit/>} />
	                <Route path="/admin/directions" element={<DirectionList/>} />
	                <Route path="/admin/directions/new" element={<DirectionCreate/>} />
	                <Route path="/admin/directions/edit/:id" element={<DirectionEdit/>} />
	                <Route path="/admin/entities" element={<EntitiesList/>} />
	                <Route path="/admin/entities/new" element={<EntitiesCreate/>} />
	                <Route path="/admin/entities/edit/:id" element={<EntitiesEdit/>} />
	                <Route path="/admin/documentaryresources" element={<DocumentaryList/>} />
	                <Route path="/admin/documentaryresources/new" element={<DocumentaryCreate/>} />
	                <Route path="/admin/documentaryresources/edit/:id" element={<DocumentaryEdit/>} />
	                <Route path="/admin/documentaryresources/show/:id" element={<DocumentaryShow/>} />
					<Route path="/admin/posttypes" element={<PostTypeList/>} />
					<Route path="/admin/posttypes/new" element={<PostTypeCreate/>} />
					<Route path="/admin/posttypes/edit/:id" element={<PostTypeEdit/>} />
					<Route path="/admin/themes" element={<ThemeList/>} />
					<Route path="/admin/themes/new" element={<ThemeCreate/>} />
					<Route path="/admin/themes/edit/:id" element={<ThemeEdit/>} />
	                <Route path="/admin/infos" element={<InfoList/>} />
	                <Route path="/admin/infos/new" element={<InfoCreate/>} />
	                <Route path="/admin/infos/edit/:id" element={<InfoEdit/>} />
	                <Route path="/admin/visitors" element={<VisitorList/>} />
	                <Route path="/admin/about" element={<About/>} />
					<Route path="/admin/aboutmoh" element={<AboutMOH/>} />
	            </Routes>
	        </Router>
	        <ToastContainer style={{ zIndex: 9999999 }} />
        </>
    );
}
   
export default Main;
   
if (document.getElementById('app')) {
    //ReactDOM.render(<Main />, document.getElementById('app'));
	createRoot(document.getElementById('app')).render(<Main />)
}

