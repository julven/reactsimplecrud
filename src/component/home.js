import React, { Component } from 'react';
import fb from './firebase';
import Store from './redux';

class Home extends Component{
	constructor(props) {
		super(props);
		this.state = {
			user: {
				fname: '',
				lname: '',
				bday: '',
				gender: '',
			},
			total: 0,
			male: 0,
			female: 0,
			loading: true,
		};
	}
	componentDidMount() {
		this.setState({user: Store.getState()});

		fb.read('react_list').then(resp => {
			resp.forEach( x => {
				if(Object.entries(x.data()).length > 0) {
					this.setState({total: this.state.total + 1});
					let data = x.data();
					if(data.gender === 'male') this.setState({male: this.state.male + 1});
					else this.setState({female: this.state.female + 1});
				}
			});
			this.setState({loading: false})
			// console.log(this.state)
		});


	}
	render() {
		let { fname } = this.state.user, { total, male, female, loading } = this.state;
		return (
			<div className="row" style={{marginTop: 30}}>
				

				<div className="card col s10 m8 l6 xl4">
					<div className="card-content">
						<p className="card-title">Summary</p>
						<div className="row col s12 m10 ">
					
					
						{
							loading ? <p>loading...</p>
							:
							<table style={{marginBottom:20}}>
								
								<tbody>
									<tr>
										<td >Users:</td>
										<td>{total}</td>
									</tr>
									<tr>
										<td >Male:</td>
										<td >{male}</td>
									</tr>
									<tr>
										<td >Female:</td>
										<td>{female}</td>
									</tr>
								</tbody>
							</table>
						}
						</div>
					</div>
					
				</div>
				

			<style jsx="true">{`
				td {
					width: 50%;
				}
			`}</style>
			</div>
		);
	}
}

export default Home;