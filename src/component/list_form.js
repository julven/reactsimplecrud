import React, { useEffect, useState } from 'react';
import fb from './firebase';
import M from 'materialize-css';
import $ from 'jquery';
import moment from 'moment';
const DEFAULT_IMAGE = "https://firebasestorage.googleapis.com/v0/b/test1-499cb.appspot.com/o/images%2Fdefault.jpeg?alt=media&token=50ae389c-c357-4c3b-a565-140b727cf73d";


const Form = ({ tab, type, account }) => {
    let inputfile = null;
	const [ form, setform ] = useState({
		fname: '',
		lname: '',
		bday: '',
		gender: '',
		image: null,
    });
    const [ image, setImage ] = useState(null);
    const [ valids, setValids ] = useState([ true, true, true, true, true ]);
    const [ loading, setLoading ] = useState(false);
    useEffect( () => {
		// console.log({account: account});
		if(type === 'update') {
			 setform(account);
             setImage(account.image);
             
        }  
        M.FormSelect.init(document.getElementById('gender'));
    }, []);

    $(document).ready(() => {
        
        M.Datepicker.init(document.getElementById('bday'), {
            format: 'yyyy-mm-dd',
            yearRange: [1900, (new Date()).getFullYear()],
            onSelect: (date) => setDate(date)
            
        });
    });
    
    const setDate = date => { 
        setform({
            ...form,
            bday: moment(date).format("YYYY-MM-DD")
        });
        // console.log(form);
        M.updateTextFields();
    }
   
   

    const updateForm = (data) => {
		// console.log({name: data.name, value: data.value});
		let value = '';
		if (data.name !== 'image') value = data.value;
		else value = data.files[0];
			
		// console.log(value)
		setform({
			...form,
			[data.name] : value
        });
        M.updateTextFields();
    }
    
    const formCheck = async (data) => {
		let new_valids = [...valids], valid = true;
		await Object.keys(data).forEach( (x, i) => {
			
			
			if(data[x] === '' || data[x] === undefined) {
				new_valids[i] = false;
				valid = false;
			} else new_valids[i] = true;
			
			
		});
		await setValids(new_valids);
		return valid;
    }
    
    const submit = () => {
        // console.log(form.image);
        
		let valid = true, new_valids = [...valids];
		Object.keys(form).forEach( (x, i) => {
			
			
			if(form[x] === '' || form[x] === undefined) {
				new_valids[i] = false;
				valid = false;
			} else new_valids[i] = true;
			
			
		});
		setValids(new_valids);
		

		if(valid) {
            setLoading(true);
			uploadImage(form.image).then( resp => {
				// console.log(resp);
				let new_form = {...form};
				new_form.image = resp;

				fb.create('react_list', new_form).then(resp2 => {
                    setLoading(false);
					alert('new User added!');
					tab(1, 'create', null);
				});
				

			});
		}else alert("please fill up the required fields!");
    }
    
    const update = async () => {
        setLoading(true);
		let data = {
			fname: form.fname,
			lname: form.lname,
			bday: form.bday,
			gender: form.gender,
		};

		// console.log(data,form,account);

		if(await formCheck(data)) {
			fb.update('react_list', form.id, data).then( resp => {
                setLoading(false);
				alert("User Updated!");
				tab(1,'create', null);
			});
		}else alert("please fill up the required fields!");
    }
    
    const imageChange = (img) => {
        console.log(img)
		if(img !== undefined) {
			uploadImage(img).then(resp => {
                fb.update('react_list', form.id, {image: resp});
                setImage(resp);
			});
		}
		
    }
    
    const uploadImage = (image) => {
		return new Promise( resolve => {
			// let data = new FormData();
			// data.append( 'image', image );
			// $.ajax({
			// 	type: 'POST',
			// 	url: 'https://julvenreactsample.000webhostapp.com/uploads.php',
			// 	data: data,
			// 	contentType: false,
			// 	processData: false

			// }).then( resp => {
			// 	resolve(resp);
            // })
            
            fb.storage(image).then(resp => resolve(resp));
		})
    }
    
    return (
		<div className="row">
            <div className="col s12 m10 l8 xl6" >
                <div className="card" >
                    <div className="card-content ">
                        <p className="card-title">{type === 'create' ? 'New User' : 'Update User'}</p>
                        <div  className='input-field' >
                            <input 
                            id="fname" 
                            className={valids[0]? '' : 'invalid' }
                            type="text" 
                            name="fname"
                            value={form.fname}
                            onChange={e => updateForm(e.target)}
                            />
                            <label htmlFor="fname" className={ type === 'update' ? 'active' : ''}>First Name</label>
                        </div>

                        <div className="input-field">
                            <input 
                            id="lname" 
                            type="text" 
                            name="lname"
                            value={form.lname}
                            onChange={e => updateForm(e.target)}
                            className={valids[1]? '' : 'invalid'} />
                            <label htmlFor="lname" className={ type === 'update' ? 'active' : ''}>Last Name</label>
                        </div>

                        <div className="input-field" >
                            <input 
                            id="bday" 
                            type="text" 
                            name="bday"
                            value={form.bday}
                        
                            onChange={e => updateForm(e.target)}
                            className={`${valids[2]? '' : 'invalid'} datepicker`} />
                            <label htmlFor="bday" className={ type === 'update' ? 'active' : ''}>Birthday</label>
                        </div>

                        <div className="input-field">
                            <select 
                            id="gender"
                            name="gender" 
                            value={account ? account.gender : '' } 
                           
                            onChange={e => updateForm(e.target)}>
                                <option value="">Select Gender</option>
                                <option value="male" >Male</option>
                                <option value="female">Female</option>
                            </select>
                            
                        </div>

                        <div className="input-field">
                        {
                            type === 'update' ?
                            <div>
                                <small style={{color: "gray"}}>Image</small><br/>
                                <img 
                                src={image} 
                                alt={image}
                                onError={(e) => e.target.src = DEFAULT_IMAGE}
                                style={{width: 120, height: 120, objectFit: 'cover'}}/><br/>
                                <input 
                                type="file"

                                ref={input => { inputfile = input }} 
                                onChange={ (e) => { imageChange(e.target.files[0]) } }
                                hidden/>
                                <button 
                                style={{width: 120}}
                                className={`btn btn-small waves-effect`}
                                onClick={() => {  inputfile.click() }}>change</button>
                            </div>
                            
                            :
                            <div>
                                <input 
                                hidden
                                name="image" 
                                type="file" 
                                ref={input => { inputfile = input }} 
                                className={valids[4]? '' : 'error'} 
                                accept="image/x-png,image/jpeg" 
                                onChange={e => updateForm(e.target)}/>
                                <button 
                                className="btn btn-small waves-effect"
                                onClick={() => {  inputfile.click() }}>Choose Image</button> <span> {form.image ? form.image.name : 'no image'}</span>
                            </div>
                
                        }
                        </div>

                        <button className="btn btn-small waves-effect" onClick={() => tab(1, 'create', null)} style={{marginRight: 3}}>cancel</button>
                        {type === 'create' && 
                        <button
                        className={loading ? 'disabled': '', "btn btn-small waves-effect"}
                        onClick={() => submit()}>Register</button>}
                        {type === 'update' && 
                        <button 
                        className={loading ? 'disabled': '', "btn btn-small waves-effect"}
                        onClick={() => update()}>Update</button>}
                   
                    </div>
                </div>
            </div>
			<style jsx="true">{`
				.error {
					border-color: pink;
				}
			`}</style>
		</div>
	);

}

export default Form;