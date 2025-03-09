
import type { Metadata } from 'next';
import RegisterForm from '@/components/forms/RegisterForm';


export const metadata: Metadata = {
	title: 'Register | Negromart',
	description: 'Negromart register page for new users',
};

const Register = () => {
    return(
		<RegisterForm />
	)
}

export default Register;
