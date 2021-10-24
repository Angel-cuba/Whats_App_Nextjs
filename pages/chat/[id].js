import styled from 'styled-components';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { db } from '../../firebaseConfig';

function Chat() {
	return (
		<Container>
			<Head>Chat</Head>
			<Sidebar />
			<ChatContainer>
				<ChatScreen />
			</ChatContainer>
		</Container>
	);
}

export default Chat;

export async function getServerSideProps(context) {
	const ref = db.collection('chats').doc(context.query.id);
	console.log('ref: ' + ref);
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
