import React, { Component } from 'react';
import Table from './list_table';
import Form from './list_form';

class List extends Component{
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			tab: 1,
			type: 'create',
			account: null,
		};
		this.setTab = this.setTab.bind(this);
		
	}
	componentDidMount() {

	}
	setTab(num, type, account) {
		this.setState({tab: num, type: type, account: account});
	}
	
	
	render() {
		return (
			<div style={{marginTop: 30}}>
				{this.state.tab === 1 ? 
					<Table tab={ this.setTab }/> : 
					<Form tab={ this.setTab } type={this.state.type} account={this.state.account}/> 
				}
			</div>
		);
	}
}
export default List;