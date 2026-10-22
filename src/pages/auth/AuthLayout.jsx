import { Link } from 'react-router-dom';
import { tw } from '../../utils/tw.js';
import AuthBackground from './AuthBackground';

export default function AuthLayout({ children, variant = 'login' }) {
  const registerVariant = variant === 'register';

  return (
    <div className={tw(
      'auth-theme auth-login-theme relative isolate flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 py-6 sm:px-6',
      registerVariant && 'auth-register-theme'
    )}>
      <AuthBackground />
      <Link to="/" className={tw('login-brand')} aria-label="Volver al inicio">
        <span className={tw('login-brand__tagline')}>Del campo<br />a tu mesa</span>
      </Link>
      {children}
    </div>
  );
}
