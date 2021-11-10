import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { useRouter } from 'next/router';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from '../components/Message';
import { InsertEmoticon } from '@mui/icons-material';
import MicIcon from '@mui/icons-material/Mic';
import firebase from 'firebase/compat/app';
import { getRecipientEmail } from '../util/getRecipientEmail';
import Timeago from 'timeago-react';

import { useRef, useState } from 'react';
import { Circle } from 'better-react-spinkit';

function ChatScreen({ chat, messages }) {
	// console.log(chat);
	//Need to know if user is logged in
	const [user] = useAuthState(auth);

	const [input, setInput] = useState('');

	//Ref side
	const endOfMessageRef = useRef(null);
	//Router to define routes
	const router = useRouter();
	//Hook from firebase
	const { messageSnapshot, loading } = useCollection(
		db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc')
	);
	const [lastMessageSnapshot] = useCollection(
		db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'desc')
	);
	console.log(lastMessageSnapshot);
	const [recipientSnapshot] = useCollection(
		db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
	);
	// console.log('checking', recipientSnapshot);

	const showMesagges = () => {
		if (messageSnapshot) {
			return messageSnapshot.docs.map((message) => (
				<Message
					key={message.id}
					user={message.data().user}
					message={{
						...message.data(),
						timestamp: message.data().timestamp?.toDate().getTime(),
					}}
				/>
			));
		} else {
			return JSON.parse(messages).map((message) => (
				<Message key={message.id} user={message.user} message={message} />
			));
		}
	};
	//Scroll buttom
	const ScrollToBottom = () => {
		endOfMessageRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};
	//To send  messages
	const sendMessage = (e) => {
		e.preventDefault();

		//This is to update the last seen message
		db.collection('users').doc(user.uid).set(
			{
				lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);
		console.log('firebase', firebase.firestore.FieldValue.serverTimestamp());
		db.collection('chats').doc(router.query.id).collection('messages').add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			message: input,
			user: user.email,
			photoURL: user.photoURL,
		});
		setInput('');
		ScrollToBottom();
	};

	// const recipient = () => {
	// 	if (recipientSnapshot?.docs[0]?.data() === 0) return null;

	// 	return recipientSnapshot?.docs[0]?.data();
	// };
	const recipient = recipientSnapshot?.docs?.[0]?.data();
	// console.log(recipient);
	//console.log(recipientSnapshot?.docs?.[0]?.data().photoURL);
	const recipientEmail = getRecipientEmail(chat.users, user);
	// console.log('email--', recipientEmail); email OK

	return (
		<Container>
			<Header>
				{recipient ? (
					<Avatar src={recipientSnapshot?.docs?.[0]?.data()?.photoURL} />
				) : (
					<Avatar src={recipientEmail[0]} />
				)}

				<HeaderInformation>
					<h3>{recipientEmail}</h3>
					{recipientSnapshot ? (
						<p>
							<strong>Last time active:</strong>{' '}
							{recipient?.lastSeen?.toDate() ? (
								<Timeago datetime={recipientSnapshot?.docs?.[0]?.data()?.lastSeen?.toDate()} />
							) : (
								'Unavailable'
							)}
						</p>
					) : (
						<p>Loading last active...</p>
					)}
				</HeaderInformation>

				<HeaderIcon>
					<IconButton>
						<AttachFileIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</HeaderIcon>
			</Header>
			<MessageContainer>
				{/* Showing all messages */}
				{loading ? (
					<p> </p>
				) : (
					<>
						{' '}
						{showMesagges()}
						<EndOfMessage ref={endOfMessageRef} />
					</>
				)}
			</MessageContainer>

			<InputContainer>
				{/* <InsertEmoticon /> */}
				<Input value={input} onChange={(e) => setInput(e.target.value)} />
				<button hidden disable={!input} type="submit" onClick={sendMessage}>
					Send message
				</button>
				{/* <MicIcon /> */}
			</InputContainer>
		</Container>
	);
}

export default ChatScreen;

const media = {
	mobile: `@media(max-width:600px)`,
	small: `@media(max-width:500px)`,
	ipad: `@media(max-width:740px)`,
};

const Container = styled.div`
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
`;

const Header = styled.div`
	position: sticky;
	background-color: #d3d3d3;
	z-index: 100;
	display: flex;
	padding: 11px;
	border-bottom: 0.51px solid rgba(0, 0, 0, 0.18);
	align-items: center;
	top: 0;
	${media.ipad} {
		padding-top: 5px;
		padding-bottom: 0px;
	}
`;

const Input = styled.input`
	flex: 1;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	outline: none;
	border-radius: 10px;
	margin-left: 15px;
	margin-right: 15px;
	background-color: whitesmoke;
`;

const HeaderInformation = styled.div`
	margin-left: 15px;
	flex: 1;
	${media.mobile} {
		margin-left: 5px;
	}

	> h3 {
		margin-bottom: 3px;
	}
	> p {
		font-size: 14px;
		color: #000000;
	}
`;

const HeaderIcon = styled.div`
	${media.ipad} {
		display: none;
	}
`;

const MessageContainer = styled.div`
	padding: 30px;
	background-color: #e5ded8;
	min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 5px;
	position: sticky;
	bottom: 0;
	background-color: #e5ded8;
	border-radius: 1px solid silver;
	z-index: 100;
	${media.ipad} {
		bottom: 10px;
	}
`;
