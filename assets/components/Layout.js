import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom"
import Swal from 'sweetalert2'
// import '../styles/sidebars.css'
   
const Layout = ({children}) =>{
	var userRating = document.querySelector('#app')
    var isAuthenticated = userRating.dataset.isAuthenticated
    if (isAuthenticated) {
    	var userFO = JSON.parse(userRating.dataset.user)
    	var userData = {
    		'email': userFO.mail,
    		'firstname': userFO.fname,
    		'lastname': userFO.lname,
    		'access': userFO.access
    	}
    	localStorage.setItem('mysession', JSON.stringify(userData));
    }
	const location = useLocation()
	const navigate = useNavigate()
	const currentRoute = location.pathname
	let mysession = (localStorage.getItem('mysession') !== null) ? JSON.parse(localStorage.getItem('mysession')) : null
	const [isConnected, setIsConnected] = useState((mysession !== null) ? true : false)

	if (isConnected && mysession.access != "root") {
        showLoader()
        return window.location.href = "/"
    }

	useEffect(() => {
		var body = document.querySelector("body").getBoundingClientRect();
		if(body.width < 1200) {
            document.querySelector("body").classList.remove('toggle-sidebar')
        } else {
            document.querySelector("body").classList.add('expanded')
        }
	}, [])

	const handleSignout = () => {
        Swal.fire({
            title: 'Voulez-vous vraiment vous déconnecter?',
            icon: 'question',
            showCancelButton: true,
            customClass: {
	            confirmButton: 'btn btn-md btn-outline-primary',
	            cancelButton: 'btn btn-md btn-outline-secondary ms-2'
	        },
	        buttonsStyling: false,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed) {
            	showLoader()
            	localStorage.removeItem('mysession')
                window.location.href = '/logout'
            }
          })
    }

    const handleMenu = () => {
    	document.querySelector('body').classList.toggle('toggle-sidebar')
    }

    return(
    	<>
    		{isConnected &&
    			<>
		    		<header id="header" className="header fixed-top d-flex align-items-center">
						<div className="d-flex align-items-center justify-content-between">
							<Link to="/admin/home" className="logo d-flex align-items-center">
								<img src="/resources/img/logo.png" alt=""/>
								<span className="d-none d-lg-block me-2">DEPSI</span>
							</Link>
							<i onClick={(e)=>{e.preventDefault(); handleMenu();}} className="bi bi-list toggle-sidebar-btn"></i>
						</div>
						<nav className="header-nav ms-auto">
							<ul className="d-flex align-items-center">
								<li className="nav-item dropdown pe-3">
									<a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
										<img src="/resources/img/user-default.png" alt="Profile" className="rounded-circle"/>
										<span className="d-none d-md-block dropdown-toggle ps-2">{mysession.firstname}</span>
									</a>
									<ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
										<li className="dropdown-header">
											<h6>{mysession.firstname} {mysession.lastname}</h6>
											{/*<span>Administrateur</span>*/}
										</li>
										<li><hr className="dropdown-divider"/></li>
										<li>
											<a className="dropdown-item d-flex align-items-center" href="#">
												<i className="bi bi-gear"></i>
												<span>Paramètre</span>
											</a>
										</li>
										<li><hr className="dropdown-divider"/></li>
										<li>
											<a onClick={(e)=>{e.preventDefault(); handleSignout();}} className="dropdown-item d-flex align-items-center">
												<i className="bi bi-box-arrow-right"></i>
												<span>Se déconnecter</span>
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</nav>
					</header>
					<aside id="sidebar" className="sidebar">
						<ul className="sidebar-nav" id="sidebar-nav">
							<li className="nav-item">
								<Link
									to="/admin/home"
									className={(currentRoute.includes('admin/home')) ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-house-fill fs-5"></i>
									<span>Accueil</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/users"
									className={currentRoute.includes('/users') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-people-fill fs-5"></i>
									<span>Utilisateurs </span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/events"
									className={currentRoute.includes('/events') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-calendar-range-fill fs-5"></i>
									<span>Evènements</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/keyfigures"
									className={currentRoute.includes('/keyfigures') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-bar-chart-line-fill fs-5"></i>
									<span>Chiffres clés</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/directions"
									className={currentRoute.includes('/directions') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-diagram-3-fill fs-5"></i>
									<span>Directions</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/entities"
									className={currentRoute.includes('/entities') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-diagram-2-fill fs-5"></i>
									<span>Entités</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/documentaryresources"
									className={currentRoute.includes('/documentaryresources') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-wallet-fill fs-5"></i>
									<span>Ressources documentaires</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/themes"
									className={currentRoute.includes('/themes') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-journal-album fs-5"></i>
									<span>Thèmatique</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/posttypes"
									className={currentRoute.includes('/posttypes') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-journal fs-5"></i>
									<span>Type publication</span>s
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/infos"
									className={currentRoute.includes('/infos') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-info-circle-fill fs-5"></i>
									<span>Chiffres clés [Liste]</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/videotheques"
									className={currentRoute.includes('/videotheques') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-play-btn-fill fs-5"></i>
									<span>Vidéothèques</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/visitors"
									className={currentRoute.includes('/visitors') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-person-lines-fill fs-5"></i>
									<span>Visiteurs</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/about"
									className={currentRoute.includes('/about') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-question-circle-fill fs-5"></i>
									<span>A propos DEPSI</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/aboutmoh"
									className={currentRoute.includes('/aboutmoh') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-question-circle-fill fs-5"></i>
									<span>A propos du Ministère</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/admin/organigrammedepsi"
									className={currentRoute.includes('/organigrammedepsi') ? 'nav-link border-radius-0' : 'nav-link border-radius-0 collapsed'}>
									<i className="bi bi-question-circle-fill fs-5"></i>
									<span>Organigramme DEPSI</span>
								</Link>
							</li>
						</ul>
					</aside>
					<main id="main" className="main">{ children }</main>
					<footer id="footer" className="footer">
						<div className="copyright">
							&copy; { new Date().getFullYear() } - Tous droits réservés
						</div>
						<div className="credits">Ministère de la santé publique</div>
					</footer>
					<a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>
				</>
			}
			<div className="menu-backdrop" onClick={(e)=>{e.preventDefault();handleMenu();}}></div>
		    <div className="modal-loading">
		    	<div className="modal-loading-content">
		            <div className="modal-loading-body">
		                <div className="row">
		                    <div className="col-md-12">
								<div className="progress progress-farm">
									<div className="progress-bar"></div>
								</div>
							</div>
		                </div>
		            </div>
	        	</div>
	        </div>
        </>
    )
}
    
export default Layout;