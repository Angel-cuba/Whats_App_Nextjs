import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyB0TmDh_F5eAjozUjjYaKVim9zbS9kbmq8',
	authDomain: 'whatsapp-3466c.firebaseapp.com',
	projectId: 'whatsapp-3466c',
	storageBucket: 'whatsapp-3466c.appspot.com',
	messagingSenderId: '731224989757',
	appId: '1:731224989757:web:19a2e019cf54af64cbca54',
};
// Initialize Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, db, provider };
