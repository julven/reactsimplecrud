import React, { Component } from 'react';
import Login from './login';
import Navbar from './navbar';
import fb from './firebase';
import 'materialize-css';
import { connect } from 'react-redux';

 class Index extends Component {
    constructor (props) {
        super (props);

        this.state = {
            logged: false,
            loading: true,
        };

       
    }

    async componentDidMount() {

       


        if(!this.props.user.logged) {
            try {
                let admin = JSON.parse(window.localStorage.react_admin);
                await fb.read_id('react_admin', admin.id).then( async resp => {
    
                    if(resp.data().token === admin.token) {
                        // console.log("authenticated!")
                        await this.props.login(resp.data());
                        
                    }
                });
            } catch (err) {
                // console.log(err);
                    
            } finally {
                this.setState({ loading: false });
            }
        }
        
    }
    componentDidUpdate() {
        // console.log({state: this.state, redux: this.props})
    }


    render() {
        let { logged, loading } = this.state;
        return (
            <div>
                {loading ? <p>loading...</p> : this.props.user.logged ? <Navbar/> : <Login/>}
                <style jsx="true">{`
                    body>ul.dropdown-content {
                        z-index: 2000;
                        top: 0;
                        overflow-y: auto;
                    }
                    body>ul.dropdown-content>li{
                        display: block;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state
});

const mapDispatchToProps = dispatch => {
    return {
        login: (data) => dispatch({type: 'login', data: data})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);