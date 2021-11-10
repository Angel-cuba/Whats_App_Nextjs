import { Avatar, IconButton, Button } from '@mui/material';
import styled from 'styled-components';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import { Logout } from '@mui/icons-material';

function Sidebar() {
	//To know is user authenticated
	const [user] = useAuthState(auth);
	// console.log('avatar: ', user.photoURL);
	const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);

	const [chatSnapshot] = useCollection(userChatRef);

	const createChat = () => {
		const input = prompt('Enter an email address for the user you wish to chat with.');

		if (!input) return null;

		//Check if the chat already exists and if is valid
		if (EmailValidator.validate(input) && chatAlreadyExists && input !== user.email) {
			// Add chat into DB 'chats' collection
			db.collection('chats').add({
				users: [user.email, input],
			});
		}
	};

	const chatAlreadyExists = (recipientEmail) =>
		!!chatSnapshot?.docs.find(
			(chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
		);

	return (
		<Container>
			<div className="container">
				<Header>
					<div className="exit">
						<Logout />
						<UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
					</div>
					<IconsContainer>
						<IconButton>
							<ChatIcon />
						</IconButton>
						<IconButton>
							<MoreVertIcon />
						</IconButton>
					</IconsContainer>
				</Header>
				<div className="search">
					<Search>
						<SearchIcon />
						<SearchInput placeholder="Search in chats" color="primary" />
					</Search>
				</div>

				<SideBarButton onClick={createChat}>New chat</SideBarButton>
				{chatSnapshot?.docs.map((chat) => (
					<Chat key={chat.id} id={chat.id} users={chat.data().users} />
				))}
			</div>
		</Container>
	);
}

export default Sidebar;

const media = {
	mobile: `@media(max-width:600px)`,
	between: `@media(max-width:500px)`,
	ipad: `@media(max-width:740px)`,
};

const Container = styled.div`
	border-right: 1px solid whitesmoke;
	height: 100vh;
	/* background-color: #e5ded8; */

	overflow-y: scroll;
	.container {
		flex: 0.35;
		height: 100%;

		min-width: 300px;
		max-width: 350px;
	}
	.exit {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		top: 0;
		${media.mobile} {
			flex-direction: column;
		}
	}
	::-webkit-scrollbar {
		display: none;
	}
	${media.ipad} {
		.container {
			flex: 0.2;
			min-width: 250px;
			max-width: 300px;
			height: fit-content;
			margin-top: 20px;
		}
		.search {
			display: none;
		}
	}

	${media.mobile} {
		.container {
			flex: 0.15;
			min-width: 50px;
			max-width: 60px;
		}
	}

	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /** Firefox */
`;

const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 5px;
	border-radius: 2px;
`;

const SearchInput = styled.input`
	outline-width: 0;
	border: none;
	flex: 1;
`;

const SideBarButton = styled(Button)`
	width: 100%;
	&&& {
		border-top: 1px solid whitesmoke;
		border-bottom: 1px solid whitesmoke;
		background-color: rgba(0, 0, 0, 0.6);
		color: silver;
		font-weight: bold;
	}
	padding-top: 10px;
	padding-bottom: 10px;
`;

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: 'white';
	z-index: 1;
	justify-content: space-between;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
	margin: 20px;
	cursor: pointer;
	${media.mobile} {
		margin: 0;
	}
	:hover {
		opacity: 0.8;
	}
`;

const IconsContainer = styled.div``;
