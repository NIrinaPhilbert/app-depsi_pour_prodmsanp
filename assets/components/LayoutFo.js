import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom"
import parse from 'html-react-parser'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
// import '../styles/sidebars.css'

const dateMiseEnLigne = process.env.PROD_DATE
   
const LayoutFo = ({children}) =>{
	var userRating = document.querySelector('#app-fo')
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
	const [isConnected, setIsConnected] = useState((mysession !== null && mysession.access != "none") ? true : false)
	const [homeList, setHomeList] = useState([])
	const [visitorCount, setVisitorCount] = useState(0)
	const [docsDropdown, setDocsDropdown] = useState([])
	const [dropIsDown, setDropIsDown] = useState(false)
	const [doctypeidActiveMenu, setDocTypeActiveMenu] = useState(0)
	const [themeidActiveMenu, setThemeActiveMenu] = useState(0)
	const [showSlider, setShowSlider] = useState(false)

	

	useEffect(() => {
		document.querySelector('#spanAccueil').classList.add('customclassaccueil') ;
		console.log('l\'adresse' + currentRoute) ;

		if(currentRoute.indexOf('/infos') == -1)
		{
			setShowSlider(true) ;
		}
		
		

		fetchHomeData(currentRoute.includes('/documentaryresources') ? '/api/docs_fo/latest' : '/api/home_fo')
		/**
		* Back to top button
		*/
		let backtotop = select('.back-to-top')
		if (backtotop) {
			const toggleBacktotop = () => {
				if (window.scrollY > 100) {
					backtotop.classList.add('active')
				} else {
					backtotop.classList.remove('active')
				}
			}
			window.addEventListener('load', toggleBacktotop)
			onscroll(document, toggleBacktotop)
		}
		axios.get('/api/visitors/total')
        .then(function (response) {
            setVisitorCount(response.data)
        })
	}, [])

	const fetchHomeData = (url) => {
		var theme_id_slider = (localStorage.getItem('docstheme')) ? localStorage.getItem('docstheme') : 0 ;
		var posttype_id_slider = (localStorage.getItem('docsposttype')) ? localStorage.getItem('docsposttype') : 0 ;
		var zUrl = url ;
		console.log('ici slider => ' + zUrl + ' pas post type ni theme') ;
		
		if(url.indexOf('latest') != '-1')
		{
			if(localStorage.getItem('docstheme'))
			{
				zUrl = url + '/' + theme_id_slider + '/theme' ;
				console.log('ici slider => ' + zUrl + ' <==> theme :: ' + theme_id_slider + '==> ici') ;
				//let iElementThemeId = document.querySelector('#btntheme-' + theme_id_slider).getNamedItem('data-post-type-id').value ;
				
				
							
				setThemeActiveMenu(theme_id_slider)
				
				//console.log('Le post type de ce theme est ==>' + iPostTypeIdOfThisTheme)
			}
			if(localStorage.getItem('docsposttype'))
			{
				zUrl = url + '/' + posttype_id_slider + '/posttype' ;
				console.log('ici slider => ' + zUrl + ' <==> post type :: ' + posttype_id_slider) ;
				setDocTypeActiveMenu(posttype_id_slider)
			}
		}
		
		showLoader()
        axios.get(zUrl)
        .then(function (response) {
            setHomeList(response.data.data)
            setDocsDropdown(response.data.posttypes)
			
			localStorage.removeItem('docstheme')
			localStorage.removeItem('docsposttype')
			
            let heroCarouselIndicators = select("#hero-carousel-indicators")
			let heroCarouselItems = select('#heroCarousel .carousel-item', true)
			heroCarouselItems.forEach((item, index) => {
				(index === 0) ? heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "' class='active'></li>" : heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "'></li>"
			});
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

	const select = (el, all = false) => {
		el = el.trim()
		if (all) {
			return [...document.querySelectorAll(el)]
		} else {
			return document.querySelector(el)
		}
	}

	const onscroll = (el, listener) => {
		el.addEventListener('scroll', listener)
	}

	const handleToTop = (ev) => {
		ev.preventDefault()
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}

	const toggleMenu = (ev) => {
		ev.preventDefault()
		select('#navbar').classList.toggle('navbar-mobile')
	    ev.target.classList.toggle('bi-list')
	    ev.target.classList.toggle('bi-x')
	}

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
            	localStorage.removeItem('docstheme')
                window.location.href = '/logout'
            }
          })
    }

    const goToDocs = (theme_id) => {
		
		
		console.log('go to docs => ' + theme_id) ;
    	localStorage.setItem("docstheme", theme_id)
		//localStorage.setItem("docstheme", 56)
		//localStorage.setItem("exoelement", "exemple")
		localStorage.removeItem('docsposttype')
    	navigate('/tolistdocs')
    }
	const gotToDocsPerPosttype = (posttype_id) => {
		console.log('post type id => ' + posttype_id) ;
		localStorage.setItem("docsposttype", posttype_id)
		localStorage.removeItem('docstheme')

		navigate('/tolistdocs')
	}
	/* équivalent
	function goToDocs(theme_id)
	{
		localStorage.setItem("docstheme", theme_id)
    	navigate('/tolistdocs')
	}
	*/

    const changeStateTheme = (drop) => {
    	let tDropsAll = document.querySelectorAll('.overlay-documentary .drops')
    	for (var i = 0; i < tDropsAll.length; i++) {
	    	tDropsAll[i].querySelector('i').classList.remove('bi-chevron-down')
	    	tDropsAll[i].querySelector('i').classList.add('bi-chevron-right')
    	}
    	document.querySelector('.overlay-documentary .drop-'+drop.id).querySelector('i').classList.remove('bi-chevron-right')
    	document.querySelector('.overlay-documentary .drop-'+drop.id).querySelector('i').classList.add('bi-chevron-down')
    	let tOverlayAll = document.querySelectorAll('.overlay-documentary .themes')
    	for (var i = 0; i < tOverlayAll.length; i++) {
	    	tOverlayAll[i].classList.remove('d-block')
	    	tOverlayAll[i].classList.add('d-none')
    	}
    	let tOverlay = document.querySelectorAll('.overlay-documentary .theme-'+drop.id)
    	for (var i = 0; i < tOverlay.length; i++) {
	    	tOverlay[i].classList.remove('d-none')
	    	tOverlay[i].classList.add('d-block')
    	}
    }

    const dropDocs = () => {
		console.log('dropDocs') ;
		
    	let state = !dropIsDown
    	setDropIsDown(state)
	
    }

	const goToRessourcesDocumentaires = () => {
		//alert(theme_id) ;
		//alert('exemple') ;
		//return false ;
    	localStorage.removeItem('docstheme')
		//localStorage.setItem("docstheme", 56)
		//localStorage.setItem("exoelement", "exemple")
    	//navigate('/documentaryresources')
		window.location.href = '/documentaryresources' ;
    }

	//console.log(docsDropdown) ;
	//console.log("===////////////////////////////===") ;
	//console.log(localStorage.getItem('exoelement')) ;
	//console.log(localStorage.getItem('docstheme')) ;
	//console.log(localStorage.getItem('tinymce-autosave-/admin/home/edit/7-tiny-react_73407683211691416456531-draft')) ;
	//console.log("===////////////////////////////===") ;
    return (
    	<>
    		<header id="header" className="fixed-top d-flex align-items-center py-2 shadow">
				<div className="container d-flex align-items-center my-1">
					<h1 className="logo me-auto">
						<Link to="/">
							<img src="/resources/img/logo-minsan.png" alt="Logo" />
							<span className="ms-1">&nbsp;</span>
						</Link>
						<Link to="/">
							<img src="/resources/img/logo.png" alt="Logo" />
							<span className="ms-1">DEPSI</span>
							
						</Link>
					</h1>
					<nav id="navbar" className="navbar">
						<ul>
							<li><Link to="/" className={currentRoute == '/' ? 'active' : ''}><span id="spanAccueil" className="homeclass">ACCUEIL</span></Link></li>
							<li className="dropdown-docs">
								<Link to="#" className={currentRoute.includes('/documentaryresources') ? 'active' : ''}><span>RESSOURCES DOCUMENTAIRES</span> <i className="bi bi-chevron-down"></i></Link>
								<div onClick={(e)=>{e.preventDefault(); goToRessourcesDocumentaires();}} className="divGoToRessourcesDocumentaire" onMouseOver={(e)=>{e.preventDefault(); dropDocs();}}>
									
								</div>
							</li>
							<li><Link to="/videotheques" className={currentRoute == '/videotheques' ? 'active' : ''}><span>VIDEOTHEQUES</span></Link></li>
							<li><Link to="/infos" className={currentRoute.includes('/infos') ? 'active' : ''}><span>CHIFFRES CLES</span></Link></li>
							<li className="dropdown">
								<Link to="#"><span>A PROPOS</span><i className="bi bi-chevron-down"></i></Link>
								<ul className="">
									<li><Link to="/aboutmoh" className={currentRoute.includes('/aboutmoh') ? 'active' : ''}>Organigramme Ministère</Link></li>
									<li><Link to="/about" className={currentRoute.includes('/about') ? 'active' : ''}>Mots de la DEPSI</Link></li>
									<li><Link to="/organigrammedepsi" className={currentRoute.includes('/organigrammedepsi') ? 'active' : ''}>Organigramme DEPSI</Link></li>
								</ul>
							</li>
							{!isConnected && <li><a href="/login" className={'getstarted'}>Membre ?</a></li>}
							{isConnected && <li><a onClick={(e)=>{e.preventDefault(); handleSignout();}} className={'getstarted'}><span>{mysession.firstname} {mysession.lastname}</span> <i className="bi bi-power fs-5 ms-2"></i></a></li>}
						</ul>
						<i className="bi bi-list mobile-nav-toggle" onClick={e=>toggleMenu(e)}></i>
					</nav>
				</div>
			</header>
			{dropIsDown &&
				<div className="overlay-documentary position-fixed bg-white w-100 py-1">
					<div className="list-group">
						
						{docsDropdown.map((dropdown, keyDrop) => {
		                	return (
				                <div key={"contentDrop"+keyDrop}>
				                	<button
										id={"posttype" + dropdown.id}
				                		key={"dropOv"+keyDrop}
				                		type="button"
				                		className={"list-group-item list-group-item-action" + " drops drop-"+dropdown.id + " " + (dropdown.id == dropdown.posttypeactive ? "active" : "")}
				                		aria-current="true"
				                		onClick={(e)=>{e.preventDefault(); changeStateTheme(dropdown);}}
										
				                	>
				                		<i className="bi bi-chevron-right me-2"></i><span>{dropdown.designation}</span>
					                </button>
					                {dropdown.themes.map((theme, keyTheme) => {
										document.querySelector('#spanAccueil').classList.add('customclassposttype') ;
										/*
										console.log(themeidActiveMenu) ;
										if(themeidActiveMenu == theme.id)
										{
											console.log('ici boucle') ;
											document.querySelector("#posttype" + dropdown.id).classList.add("active") ;
										}*/
										return (
											<button
												id={"btntheme" + theme.id}
												key={"themeOv"+keyTheme}
												type="button"
												className={"list-group-item list-group-item-action ps-5 d-none" + " themes theme-"+dropdown.id + (theme.id == themeidActiveMenu ? " active" : "")}
												aria-current="true"
												onClick={(e)=>{e.preventDefault(); goToDocs(theme.id);}}
											>
												{theme.designation}
											</button>
										)
										
										
									})}
				                </div>
				            )
						})}
		            </div>
				</div>
			}
			{showSlider && 
				<section className="hero testhero" id="hero">
					<div id="heroCarousel" data-bs-interval="5000" className="carousel slide carousel-fade" data-bs-ride="carousel">
						<ol className="carousel-indicators" id="hero-carousel-indicators"></ol>
						{homeList.map((doc, key)=>{
							return (
								<div className="carousel-inner" role="listbox" key={key}>
									{currentRoute.includes('/documentaryresources')

										? <>
											{/* amelioration 07082023 */}
												<div className={`carousel-item doc-item ${key == 0 ? 'active' : ''}`} key={"keySlide"+key}>
													{doc.map((docData, keyDoc) => {
														return (
															<Link className="doc-link" to={`/documentaryresources/${docData.id}`} key={"keyData"+keyDoc}>
																{doc.length == 3 &&
																	<img className={`doc-img doc-img-3`} style={{zIndex: "0"}} src={docData.imageFile} />
																}
																{doc.length == 2 &&
																	<img className={`doc-img doc-img-2`} style={{zIndex: "0"}} src={docData.imageFile} />
																}
																{doc.length == 1 &&
																	<img className={`doc-img doc-img-1`} style={{zIndex: "0"}} src={docData.imageFile} />
																}
															</Link>
														)
													})}
												</div>
											{/* /. amelioration 07082023 */}
										</>
										: <div className={`carousel-item ${key == 0 ? 'active' : ''}`} style={{ backgroundImage: `url(${doc.imageFile})` }}>
											<div className="carousel-container">
												<div className="container">
													<h2 className="animate__animated animate__fadeInDown">{doc.title}</h2>
													<article className="animate__animated animate__fadeInUp"></article>
													<Link to={`/details/${doc.id}`} className="btn-get-started animate__animated animate__fadeInUp scrollto">Voir plus</Link>
												</div>
											</div>
										</div>
									}
								</div>
							)
						})}
						<a className="carousel-control-prev" href="#heroCarousel" role="button" data-bs-slide="prev">
							<span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
						</a>
						<a className="carousel-control-next" href="#heroCarousel" role="button" data-bs-slide="next">
							<span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
						</a>
					</div>
				</section>
			}
			
			<main id="main">
				<section id="portfolio" className="portfolio">
					<div className="container">{children}</div>
				</section>
			</main>
			<footer id="footer">
				<div className="footer-top">
					<div className="container">
						<div className="row">
							<div className="col-lg-3 col-md-6">
								<div className="footer-info">
									<h3>
										<img src="/resources/img/logo.png" height={40} alt="Logo" />
										<span className="ms-1">DEPSI</span>
									</h3>
									<p>
									Direction des Etudes, de la Planification et du Système d'Information<br/>
									2ème étage Bâtiment Administratif du Ministère de la Santé Publique Ambohimiandra <br/> Anatananarivo II  <br/>
										<br/>
										<strong>Email:</strong> msanpdepsi@gmail.com<br/>
									</p>
									<div className="social-links mt-3">
										<a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
										<a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
										<a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
										<a href="#" className="google-plus"><i className="bi bi-skype"></i></a>
										<a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
									</div>
								</div>
							</div>
							<div className="col-lg-2 col-md-6 footer-links">
								<h4>Liens utiles</h4>
								<ul>
									<li><i className="bi bi-chevron-right"></i> <Link to="https://portail.snis-sante.mg">Home</Link></li>
									<li><i className="bi bi-chevron-right"></i> <a href="https://workflow.snis-sante.net">Demande de prestation en TIC</a></li>
									<li><i className="bi bi-chevron-right"></i> <Link to="/feedback"><strong>Feedback</strong></Link></li>
								</ul>
							</div>
							<div className="col-lg-3 col-md-6 footer-links">
								<h4>Données SNIS</h4>
								<ul>
									<li><i className="bi bi-chevron-right"></i> <a href="https://ministere-sante.mg">Routines</a></li>
									<li><i className="bi bi-chevron-right"></i> <a href="https://simr.snis-sante.net">Surveillance</a></li>
									<li><i className="bi bi-chevron-right"></i> <a href="https://covax.vaksiny.gov.mg">Vaccination COVID</a></li>
									<li><i className="bi bi-chevron-right"></i> <a href="">Ressources (autres que matériels)</a></li>
									<li><i className="bi bi-chevron-right"></i> <a href="https://sygma.snis-sante.net/">Matériels</a></li>
								</ul>
							</div>
							<div className="col-lg-4 col-md-6 footer-newsletter">
								<h4>Nombre de visiteurs</h4>
								<p className="fs-6">Total : {visitorCount}</p>
								<p className="mt-3">Date de mise en ligne {dateMiseEnLigne}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="copyright">
						&copy; Copyright {new Date().getFullYear()}. Tous droits réservés
					</div>
					<div className="credits">
						Ministère de la santé publique
					</div>
					<div className="credits">
						<h1 className="logo me-auto">
							<Link to="/">
								<img src="/resources/img/who-logo-png-transparent.png" alt="Logo" className="logo_bas"/>
								
							</Link>
						</h1>
					</div>
				</div>
			</footer>
			<a onClick={e=>handleToTop(e)} className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>
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
    
export default LayoutFo;