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
			<Header>
				<UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

				<IconsContainer>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</IconsContainer>
			</Header>

			<Search>
				<SearchIcon />
				<SearchInput placeholder="Search in chats" color="primary" />
			</Search>

			<SideBarButton onClick={createChat}>Start a new chat</SideBarButton>
			{chatSnapshot?.docs.map((chat) => (
				<Chat key={chat.id} id={chat.id} users={chat.data().users} />
			))}
		</Container>
	);
}

export default Sidebar;

const Container = styled.div`
	flex: 0.35;
	border-right: 1px solid whitesmoke;
	height: 100vh;
	min-width: 300px;
	max-width: 350px;
	overflow-y: scroll;

	::-webkit-scrollbar {
		display: none;
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
	margin: 10px;
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
`;

const IconsContainer = styled.div``;
