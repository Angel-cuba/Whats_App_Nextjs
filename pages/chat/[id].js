import styled from 'styled-components';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { db, auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getRecipientEmail } from '../../util/getRecipientEmail';

function Chat({ chat, messages }) {
	const [user] = useAuthState(auth);
	console.log(user);
	return (
		<Container>
			<Head>
				<title>Chat with {getRecipientEmail(chat.users, user)}</title>
			</Head>
			<Sidebar />
			<ChatContainer>
				<ChatScreen chat={chat} messages={messages} />
			</ChatContainer>
		</Container>
	);
}

export default Chat;

export async function getServerSideProps(context) {
	const ref = db.collection('chats').doc(context.query.id);
	// console.log('ref: ' + ref);

	//Searching for messages on the server
	const messagesResponse = await ref.collection('messages').orderBy('timestamp', 'asc').get();

	const messages = messagesResponse.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.map((message) => ({
			...message,
			timestamp: message.timestamp.toDate().getTime(),
		}));

	// Working on chat
	const chatResponse = await ref.get();
	const chat = {
		id: chatResponse.id,
		...chatResponse.data(),
	};
	console.log(chat, messages);
	//Here return the messages and the chat info
	return {
		props: {
			messages: JSON.stringify(messages),
			chat: chat,
		},
	};
}

const Container = styled.div`
	display: flex;
`;

const ChatContainer = styled.div`
	background-color: #e0d2c7;
	flex: 1;
	overflow: scroll;
	height: 100vh;
`;
