import React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import fb from './firebase'
const DEFAULT_IMAGE = "https://firebasestorage.googleapis.com/v0/b/test1-499cb.appspot.com/o/images%2Fdefault.jpeg?alt=media&token=50ae389c-c357-4c3b-a565-140b727cf73d";
const Table = ({ tab }) => {
    
    const history = useHistory();
    const params = useParams();
    const [ list, setList ] = useState([]);
    const [ loading, setLoading] = useState(true);
    const [ pages, setPages ] = useState({
        total: 0,
        current: 1,
        display: 6
    });
  

    useLayoutEffect(() => {
        
        getList();
        console.log(history);
    }, []);

    const checkParams = () => {
        if(Object.keys(params).length > 0 && !isNaN(params.page) && Number(params.page) >= 1) {
            let page = Number(params.page);
            // console.log(params.page, pages.total)
            return page;

        } return 1;
    }
    
    const getList = async () => {

        let new_list = [], current = checkParams();
      
        
		 fb.read('react_list').then( async resp => {
			resp.forEach( (x, i) => {
				if(Object.entries(x.data()).length > 0) {
					let data = x.data();
					data.id = x.id;
					new_list = [...new_list, data];
				}
			});

            setList([...new_list]);
           
            
            setPages({
                ...pages,
                total: Math.ceil(new_list.length / pages.display),
                current: checkParams(),
            });


            setLoading(false)
            
        });	
        
        

    }

    const deletes = async id => {
		let conf = window.confirm('are you sure you want to delete this user?');
		if(conf) {
			// console.log(id);
			await fb.delete('react_list', id);
			let new_list = list.filter( x => {
				
				return x.id !== id;
			})
            
		}
    }

    const movePage = async (direction)  => {
        // console.log(direction, pages)
        
        if(direction === 'prev' && pages.current > 1) {
            await setPages({ ...pages, current: Number(pages.current) - 1 });
            history.push(`/list/${pages.current -1}`);
        } 
        else if(direction === 'next' && pages.current !== pages.total){
            await setPages({ ...pages, current:  Number(pages.current) + 1 });
            history.push(`/list/${pages.current +1}`);
        }
    }
   
    return(
		<div className="row" >
			
			
            <div className="col s12 m10 l8 xl6" >
                <div className="card" >
                    <div className="card-content row">
                        <div className="col s6 m6 l6 xl6"><p className="card-title">User List</p></div>
                        <div className="col s6 m6 l6 xl6">
                            <button className="btn btn-small waves-effect right" onClick={() => tab(2, 'create')}>New User</button>
                        </div>
                        
                        
                        <div style={{minHeight:700}}>
                            <table >
                                <thead >
                                    <tr> 
                                        <th className="center-align">Image</th>
                                        <th>Info</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {   
                                        loading ? <tr><td>loading...</td></tr>
                                        :
                                        list.map( (x, i) => {
                                            // console.log({start: (pages.current * pages.display) - pages.display, end: pages.current * pages.display})
                                            if(i >= (pages.current * pages.display) - pages.display && i < pages.current * pages.display)return (
                                                <tr key={x.id} >
                                                    <td style={{padding: 12}} className="center-align">
                                                        <img 
                                                        src={ x.image} 
                                                        alt={x.image} 
                                                        onError={(e) => e.target.src = DEFAULT_IMAGE}
                                                        style={{width: 70, height: 70, objectFit: 'cover'}}/>
                                                    </td  >
                                                    <td style={{padding: 12}}>
                                                        <p>
                                                            name: {x.fname} {x.lname}<br/>
                                                            bday: {x.bday}<br/>
                                                            gender: {x.gender}
                                                        </p>
                                                        
                                                    </td>
                                                    <td style={{padding: 12}}>
                                                        <button 
                                                        title="delete"
                                                        style={{marginBottom: 2}}
                                                        className="btn btn-small waves-effect"
                                                        onClick={() => deletes(x.id)}>
                                                            <i className="material-icons">delete_forever</i>
                                                            </button><br/>
                                                        <button 
                                                        title="edit"
                                                        className="btn btn-small waves-effect"
                                                        onClick={() => tab(2, 'update', x)}>
                                                            <i className="material-icons">edit</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <ul className="pagination">
                            <li className={`${pages.current === 1 && 'disabled'} waves-effect`}><a onClick={() => movePage('prev')}><i className="material-icons">chevron_left</i></a></li>
                            
                            {pages.current >= 4 && <li className="waves-effect"><Link to={`/list/${pages.current-3}`} onClick={() => setPages({...pages, current: pages.current-3})}>{pages.current-3}</Link></li>}
                            {pages.current >= 3 && <li className="waves-effect"><Link to={`/list/${pages.current-2}`} onClick={() => setPages({...pages, current: pages.current-2})}>{pages.current-2}</Link></li>}
                            {pages.current >= 2 && <li className="waves-effect"><Link to={`/list/${pages.current-1}`} onClick={() => setPages({...pages, current: pages.current-1})}>{pages.current-1}</Link></li>}
                            <li className="waves-effect active"><Link to={`/list/${pages.current}`} >{pages.current}</Link></li>
                            {pages.current + 1 <= pages.total && <li className="waves-effect"><Link to={`/list/${pages.current+1}`} onClick={() => setPages({...pages, current: pages.current+1})}>{pages.current+1}</Link></li>}
                            {pages.current + 2 <= pages.total && <li className="waves-effect"><Link to={`/list/${pages.current+2}`} onClick={() => setPages({...pages, current: pages.current+2})}>{pages.current+2}</Link></li>}
                            {pages.current + 3 <= pages.total && <li className="waves-effect"><Link to={`/list/${pages.current+3}`} onClick={() => setPages({...pages, current: pages.current+3})}>{pages.current+3}</Link></li>}
                            <li className={`${pages.current === pages.total && 'disabled'} waves-effect`}><a onClick={() => movePage('next')}><i className="material-icons">chevron_right</i></a></li>
                        </ul>
                    </div>
                </div>
               
            </div>
		</div>
	);
}

export default Table;