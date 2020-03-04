import React, { Component } from 'react';
import Store from './redux';
import fb from './firebase';


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            pass: '',
            valid: true,
        };
    }

    componentDidMount() {

    }
    login() {
        // Store.dispatch({type: 'login'})
        fb.specific('react_admin','user', this.state.user).then(resp => {
			if(resp.length > 0 && resp[0].data().pass === this.state.pass) {
				// console.log(resp[0].data());
				let token = Math.floor((Math.random() * 99999) + 10000), 
					id = resp[0].id;

				fb.update('react_admin', id, {token: token}).then( () => {
					window.localStorage.react_admin = JSON.stringify({id: id, token: token});
					Store.dispatch({type: 'login', data: resp[0].data()});
				});
			} else {
				// console.log('invalid user or pass');
				alert('invalid username or password!');
				this.setState({valid: false});
				// console.log(this.state.valid)
			}
		});
        
    }

    render() {
        let { user, pass, valid } = this.state;
        return (
         <div className="row container" style={{marginTop: 70}}>
            <div className="col s12 m10 l8 xl5">
                <div className="card">
                    <div className="card-content row">
                        
                        <div className="col s10 m9 l10 xl10">
                            <p className="card-title">Login Admin</p>
                            <div className="input-field">
                                <i className="material-icons prefix" style={{top: 12}}>account_box</i>
                                <label htmlFor="user">Username</label>
                                <input 
                                className={valid ? '':'invalid'}
                                type="text" 
                                id="user" 
                                value={user}
                                name="user"
                                onChange={ e => { this.setState({user: e.target.value}) } }/>
                            </div>

                            <div className="input-field">
                                <i className="material-icons prefix" style={{top: 12}}>lock</i>
                                <label htmlFor="pass">Password</label>
                                <input 
                                className={valid ? '':'invalid'}
                                type="password" 
                                id="pass" 
                                name="pass"
                                value={pass}
                                onChange={ e => { this.setState({pass: e.target.value}) } }/>
                            </div>

                            <button 
                             onClick={() => { this.login() }}
                            className="btn btn-small waves-effect">Login</button>
                        </div>
                        
                    </div>
                </div>

            </div>
             
        <style jsx="true">{`
            .error {
                background-color: pink;
            }
        `}</style>
         </div>
        )
    }
}