import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { getRecipientEmail } from '../util/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';

import { useRouter } from 'next/router';

function Chat({ id, users }) {
	const router = useRouter();
	// console.log('id--->', id);
	// console.log('users--->', users);
	const [user] = useAuthState(auth);
	const [recipientSnapshot] = useCollection(
		db.collection('users').where('email', '==', getRecipientEmail(users, user))
	);
	// console.log('user-->', user);
	const host = recipientSnapshot?.docs?.[0]?.data();
	const recipientEmail = getRecipientEmail(users, user);
	// console.log('host-->', host);
	// console.log('recipientEmail---->', recipientEmail);

	const enterChat = () => {
		router.push(`/chat/${id}`);
	};
	return (
		<Container onClick={enterChat}>
			{host ? (
				<UserAvatar src={host?.photoURL || user.photoURL} />
			) : (
				<UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
			)}

			<p>{recipientEmail}</p>
			{/* <p>
				{users.map((user, index) => (
					<p key={index}>{user}</p>
				))}
			</p>*/}
		</Container>
	);
}

export default Chat;
const media = {
	mobile: `@media(max-width:600px)`,
	ipad: `@media(max-width:740px)`,
};

const Container = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	word-break: break-word;

	:hover {
		background-color: #e9eaeb;
	}
	${media.mobile} {
		align-items: align-self;

		p {
			display: none;
		}
	}

	${media.ipad} {
	}
`;

const UserAvatar = styled(Avatar)`
	margin: 5px;
	margin-right: 15px;
`;
