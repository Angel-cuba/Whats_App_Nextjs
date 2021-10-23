import { Circle } from 'better-react-spinkit';

function Loading() {
	// const url = 'http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png';
	const url =
		'https://res.cloudinary.com/dqaerysgb/image/upload/v1628772923/ioyht3mnqdg9yojvji3i.jpg';
	return (
		<center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
			<div>
				<img
					src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
					alt=""
					style={{ marginBottom: 10 }}
					height={200}
				/>
				<Circle color="#3CBC28" size={60} />
			</div>
		</center>
	);
}

export default Loading;
