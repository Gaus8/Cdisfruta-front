import { useGoogleLogin } from '@react-oauth/google';

export default function  LoginGoogle (){
  
  // Este hook genera la función que "despierta" a Google
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Éxito:", tokenResponse);
      // Aquí envías el token a tu backend de Express/MongoDB
      handleGoogleSuccess(tokenResponse); 
    },
    onError: () => console.log('Login Failed'),
  });

  return (
    <div className="google-btn-container">
      {/* Ahora el onClick llama a la función 'login' del hook */}
      <button className="button-google" type="button" onClick={() => login()}>
        <img src="/img/google_logo.png" alt="Google" />
        <span>Acceder con Google</span>
      </button>
    </div>
  );
};