import { createStore } from 'redux';

const initState = {
    logged: false,
    fname: '',
	lname: '',
	bday: '',
	gender: '',
	user: '',
};

const Store = createStore( (state = initState, action) => {
    if(action.type === 'login') {
        let { fname, lname, bday, gender, user } = action.data;
        return { 
            logged: true,
            fname: fname,
            lname: lname,
            bday: bday,
            gender: gender,
            user: user,
        }
    }
     if(action.type === 'logout') return { 
        logged: false,
        fname: '',
        lname: '',
        bday: '',
        gender: '',
        user: '',
     }
	else return state;
});

export default Store;