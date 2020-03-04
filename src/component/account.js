import React, { Component } from 'react';
import fb from './firebase';
import M from 'materialize-css';
import moment from 'moment';
import { connect } from 'react-redux';

class Account extends Component{
	constructor(props) {
		super(props);
		
		this.state = {
            id: JSON.parse(window.localStorage.react_admin).id,
			admin: {},
			edit: false,
			passEdit: false,
			valids: [ true, true, true, true ],
			passValids: [ true, true ],
			pass: '',
			conf: '',
		};

	}
	componentDidMount() {
		
		
		
		
		this.setState({admin: this.props.user});

	}

	componentDidUpdate() {
		// console.log({acc: [this.state.admin, this.props.user]})
		let { edit } = this.state;
		// console.log(edit);
		
		if(edit) {
			// console.log('meterial component init!')
			M.FormSelect.init(document.getElementById('gender'))
			M.Datepicker.init(document.getElementById('bday'), {
				format: "yyyy-mm-dd",
				yearRange: [1900, (new Date()).getFullYear()],
				onSelect: date => { this.setBday(date)}
			});
			
		}
	}

	setBday(date) {
		// console.log(date)
		this.setState(prev => ({
			admin: {
				...prev.admin,
				bday: moment(date).format("YYYY-MM-DD")
			}
		}));
	}

	editing(type) {
		// console.log(type); 
		if(type === 'info'){
			this.setState({edit: true, passEdit: false})
		}else {
			this.setState({passEdit: true, edit: false})
		}

	}
	
    async formCheck(data) {
		let new_valids = [...this.state.valids], valid = true;
		await Object.keys(data).forEach( (x, i) => {
			
			
			if(data[x] === '' || data[x] === undefined) {
				new_valids[i] = false;
				valid = false;
			} else new_valids[i] = true;
			
			
		});
		await this.setState({valids: new_valids});
		return valid;
    }
    update() {
		this.formCheck(this.state.admin).then( async resp => {
			
			if(resp) {

				await fb.update('react_admin', this.state.id, this.state.admin);
				alert("Account Updated!");
				this.props.updateUser(this.state.admin);
				this.setState({edit: false});
			}else alert("please fill up the required fields!");
		})

    }
    async changeInfo(data) {
		let { value, name } = data;
		// console.log(name, value);

		await this.setState( prev => ({
			admin: {
				...prev.admin,
				[name] : value
			}
		}));

		// console.log(this.state.admin)
    }
    async changePass() {
		let { pass, conf } = this.state, passValids = [...this.state.passValids];
		// console.log(pass, conf);

		if(pass !== '' && conf !== '' ) {
			if(conf === pass) {
				passValids[0] = true;
				passValids[1] = true;
				await fb.update('react_admin', this.state.id, {pass: pass});
				alert('Password Updated!');
				this.setState({passEdit: false, passValids: passValids, conf: '', pass: ''});
			}else {
				alert("password did not match!");
				passValids[0] = false;
				passValids[1] = false;
				this.setState({passValids: passValids});

			}
		}else {
			alert("invalid password");
			passValids[0] = false;
			passValids[1] = false;
			this.setState({passValids: passValids});
        }
    }
    cancel() {
		this.setState({edit: false, admin: this.props.user});
	}
	render() {
        let { fname, lname, gender, bday, user } = this.state.admin,
			{ edit, valids, passEdit, passValids, pass, conf } = this.state;
		return (
<div className="row"  style={{marginTop: 30}}>
	<div className="col s12 m10 l7 xl5">
		<div className="card" >
			
			<div className="card-content row">
			
				
				<div className="col s10 m8 l8 xl10">
				<p className="card-title">Admin Info</p>
				{
				edit ?
				<div style={{marginBottom: 5}} > 
					<div className="input-field">
						<input type="text" id="fname" name="fname" className={!valids[0] ? 'error' : ''} value={fname} onChange={e => { this.changeInfo(e.target) }}/>
						<label htmlFor="fname" className={edit ? 'active' : ''}>First Name</label>
					</div>
					<div className="input-field">
						<input type="text"  id="lname" name="lname" className={!valids[1] ? 'error' : ''} value={lname} onChange={e => { this.changeInfo(e.target) }}/>
						<label htmlFor="lname" className={edit ? 'active' : ''}>Last Name</label>
					</div>
					<div className="input-field">
						<input type="text" id="bday" name="bday" className={!valids[2] ? 'error' : ''} value={bday} onChange={e => {  }}/>
						<label htmlFor="bday" className={edit ? 'active' : ''}>Birthday</label>
					</div>


					<select name="gender" id="gender" value={gender} onChange={ (e) => { this.changeInfo( e.target ) }}>
						<option value="">select gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>
				:
				<table style={{marginBottom: 5}} hidden={edit}>
					<tbody>						
						<tr>
							<td>Name:</td>
							<td>{fname}</td>								
						</tr>
						<tr>
							<td>Last:</td>
							<td>{lname}</td>								
						</tr>
						<tr>
							<td>Birthday:</td>
							<td>{bday}</td>							
						</tr>
						<tr>
							<td>Gender:</td>
							<td>{gender}</td>							
						</tr>
					</tbody>
				</table>

				}
				<div style={{marginBottom: 30}}>
					{
					!this.state.edit ? 
					<button 
					className="btn btn-small waves-effect"

					onClick={() => { this.editing('info') }}>Edit</button>
					:
					<div> 
						<button className="btn btn-small waves-effect" style={{marginRight: 5}} onClick={() => { this.cancel() }}>Cancel</button>
						<button className="btn btn-small waves-effect" onClick={() => { this.update() }}>Update</button>
					</div>
					}
				</div>

		
				<p className="card-title">Admin Account</p>
				<table style={{marginBottom: 5}}>
					<tbody>
						<tr>
							<td>Username: </td>
							<td>{user}</td>
						</tr>
						<tr>
							<td>Password: </td>
							{
							!passEdit ? 
							<td>******</td>
							:
							<td>
								<input 
								type="password" 
								placeholder="new pass" 
								value={pass}
								className={!passValids[0] ? 'error' : '' }
								onChange={ e => { this.setState({pass: e.target.value}) }}
								style={{marginBottom: 3}}/><br/>
								<input 
								type="password" 
								value={conf}
								className={!passValids[0] ? 'error' : '' }
								onChange={ e => { this.setState({conf: e.target.value}) }}
								placeholder="confirm"/>
							</td>
							}
						</tr>
					</tbody>
				</table>
				{
				!passEdit ? 
				<button 
				className="btn btn-small waves-effect"
				onClick={ () => {this.editing('pass') }}>Edit</button>
				:
				<div>
					<button className="btn btn-small waves-effect" style={{marginRight: 5}} onClick={ () => { this.setState({passEdit: false}) }}>Cancel</button>
					<button className="btn btn-small waves-effect" onClick={ () => { this.changePass() }}>Update</button>
				</div>
				}
			</div>
			</div>
		</div>

		<style jsx="true">{`
		.error {
		background-color: pink;
		}
		`}</style>
	</div>
</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state
})

const mapDispatchToProps = dispatch => {
	return {
		updateUser: (data) => dispatch({type: "login", data: (data)})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);