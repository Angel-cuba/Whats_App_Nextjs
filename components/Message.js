import styled from 'styled-components';
import Timeago from 'timeago-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import moment from 'moment';

function Message({ user, message }) {
	const [userLoggedIn] = useAuthState(auth);
	// console.log('message', message);

	const newTime = new Date(message.timestamp);
	const final = newTime.toLocaleString().slice(11);
	// console.log(newTime.toLocaleString());
	// console.log(newTime);
	{
		/* <Timeago dateTime={message?.timestamp?.toDate()} /> */
	}

	const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

	return (
		<Container>
			<TypeOfMessage>
				<p>
					{message.message}
					{/* {final} */}
					<Timestamp>
						{message.timestamp ? moment(message.timestamp).format('LT') : '...'}
					</Timestamp>
				</p>
			</TypeOfMessage>
		</Container>
	);
}

export default Message;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	/* width: 200px; */
`;
const messageElement = styled.p`
	width: fit-content;
	padding: 10px;
	border-radius: 8px;
	margin: 10px;
	min-width: 80px;
	padding-bottom: 27px;
	position: relative;
	text-align: right;
`;

const Sender = styled(messageElement)`
	margin-left: auto;
	background-color: whitesmoke;
`;
const Reciever = styled(messageElement)`
	background-color: #dcf8c6;
	text-align: left;
`;

const Timestamp = styled.span`
	color: gray;
	padding: 10px;
	font-size: 10px;
	position: absolute;
	bottom: 0;
	right: 0;
	text-align: right;
`;
