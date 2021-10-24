import '../styles/globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import SideBar from '../components/Sidebar';

function MyApp({ Component, pageProps }) {
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		if (user) {
			db.collection('users').doc(user.id).set(
				{
					email: user.email,
					lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
					photoURL: user.photoURL,
				},
				{ merge: true }
			);
		}
	}, [user]);

	if (loading) return <Loading />;
	if (!user) {
		return <Login />;
	} else {
		<SideBar />;
	}

	return <Component {...pageProps} />;
}

export default MyApp;
