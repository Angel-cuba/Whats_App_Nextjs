import { Button } from '@mui/material';
import Head from 'next/head';
import styled from 'styled-components';
import { auth, provider } from '../firebaseConfig';

function Login() {
	const SignIn = () => {
		auth.signInWithPopup(provider).catch(alert);
	};

	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>

			<LoginContainer>
				{/* <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" /> */}
				<Logo src="/images/whatsapp.png" alt="What'sAPP" height={200} width={200} />
				{/* 	<img src="/images/whatsapp.png" alt="" height={200} width={200} /> */}

				<Button onClick={SignIn} variant="outlined">
					Sign In with Google
				</Button>
			</LoginContainer>
		</Container>
	);
}

export default Login;

const Container = styled.div`
	display: grid;
	place-items: center;
	height: 100vh;
`;

const LoginContainer = styled.div`
	padding: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: white;
	border-radius: 5px;
	box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.6);
`;

const Logo = styled.img`
	width: 200px;
	height: 200px;
`;
