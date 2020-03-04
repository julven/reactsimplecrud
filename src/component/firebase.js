import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyBbCI0VbwnjlY_jLSA9usbwYcMJT7ru0o0",
    authDomain: "test1-499cb.firebaseapp.com",
    databaseURL: "https://test1-499cb.firebaseio.com",
    projectId: "test1-499cb",
    storageBucket: "test1-499cb.appspot.com",
    messagingSenderId: "1096279647565",
    appId: "1:1096279647565:web:70a8b8fae3589c9c"
  };

 firebase.initializeApp(firebaseConfig);

 const db = firebase.firestore();

 var fb = {

 	create: (table, data) => {
 		return new Promise (accept => db.collection(table).add(data).then( resp => accept(resp)));
 	},
 	update: (table ,id, data) => {
		//  console.log(table, id, data);
		return db.collection(table).doc(id).update(data);
 	},
 	delete: (table, id) => {
 		return db.collection(table).doc(id).delete();
 	},
 	read: (table) => {
 		return new Promise ( (resolve, reject) => {
 			db.collection(table).get().then( snapshot => {
				resolve(snapshot.docs);
			}).catch( err => {
				reject(err);
			});
 		});
 		
 	},
    read_id: (table, id) => {
        return new Promise ( (accept, reject) => {
            db.collection(table).doc(id)
            .get()
            .then( resp => accept (resp))
            .catch( err => reject (err));
        });
    },
 	specific: (table ,what, val) => {
 		return new Promise ( (resolve, reject) => {
 			db.collection(table)
 			.where(what, '==', val)
 			.get()
 			.then( resp => resolve(resp.docs))
 			.catch( err => reject(err));
 		})
 			
 	}
 };

 export default fb;