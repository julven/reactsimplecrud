import React, { Component } from 'react';
import { Link, Route, BrowserRouter, Switch, HashRouter, } from 'react-router-dom';
import { connect } from 'react-redux';

import  Home  from './home';
import  List  from './list';
import  Account  from './account';
import M from 'materialize-css';
import $ from 'jquery';


class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
			sideNav: null,
        }
    }

    componentDidMount() {
		
		let sideNav = M.Sidenav.init(document.getElementById('sideNav'));
		M.updateTextFields();
		
		$('#openSideNav').click(() => {
			sideNav.open();
		});

		$('#sideNav>li').click(() => {
			sideNav.close();
		})
		
		
    }
    componentWillUnmount() {
		// console.log('navbar unmount!');
		
        
    }
    logout() {
		this.props.logout();
		window.localStorage.clear();
    }

    render() {
        return(
            <div>
                <BrowserRouter>
					<nav>
						<div className="nav-wrapper container">
							<Link to="/" className="brand-logo ">Admin</Link>
							<a id="openSideNav" data-target="sideNav" className="sidenav-trigger"><i className="material-icons">menu</i></a>
							<ul className="right hide-on-med-and-down">
								<li><Link to="/" >HOME</Link></li>
								<li><Link to="/list" >LIST</Link></li>
								<li><Link to="/account" >ACCOUNT</Link></li>
								<li><Link to="/" onClick = {() => this.logout()}>LOGOUT</Link></li>
							</ul>
						</div>
						
					</nav>

					<ul className="sidenav" id="sideNav">
						<li><Link to="/" >HOME</Link></li>
						<li><Link to="/list" >LIST</Link></li>
						<li><Link to="/account" >ACCOUNT</Link></li>
						<li><Link to="/" onClick = {() => this.logout()}>LOGOUT</Link></li>
					</ul>
					<div className="container">
						<Switch >
						
							<Route path="/"  exact component={ Home }></Route>
							<Route path="/list"  exact  component={ List }></Route>
							<Route path="/list/:page" component={ List }></Route>
							<Route path="/account"  component={ Account }></Route>
							<Route path="*"  render={() => { return <h2>404 page not found!</h2>}}></Route>
							
						</Switch>
					</div>

				</BrowserRouter>
				<style jsx="true">{`
					li {
						display: inline-block;
						margin-right: 5px;
						
					}
					ul {
						padding-left: 0;
						list-style-type: none;
					}
					#sideNav li {
						display: block;
					}
				`}</style>	
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => dispatch({type: "logout"}),
	}
}

export default connect(null, mapDispatchToProps)(Navbar);