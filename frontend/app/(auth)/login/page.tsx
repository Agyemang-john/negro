import { Metadata } from "next";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
	title: 'Login | Negromart',
	description: 'Negromart login page for users with account',
};

const Login = () => {
  return (
    <LoginForm />
  )
  
};

export default Login;

