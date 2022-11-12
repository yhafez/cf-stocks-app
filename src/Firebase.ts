import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'cf-stocks-app.firebaseapp.com',
	projectId: 'cf-stocks-app',
	storageBucket: 'cf-stocks-app.appspot.com',
	messagingSenderId: '950718717869',
	appId: '1:950718717869:web:66760558f96f17bc034b24',
}

const app = initializeApp(firebaseConfig)
