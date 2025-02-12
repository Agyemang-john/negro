// "use client"

import { useState } from 'react';
import { setAuthUser } from '../../utils/auth';
import api from '../../utils/api';

export const useAuth = () => {

    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(null);
    const [status , setStatus] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        setStatus(null);
        try {
            const { data, status } = await api.post('/api/v1/auth/login/', {
                email,
                password,
            });

            setStatus(status);
            if (status === 200) {
                setAuthUser(data.access_token, data.refresh_token);
            } else {
                setError('Login failed. Please try again.');
            }
            return status;
        } catch (err) {
            setStatus(err.response?.data?.status);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
            // resetForm();
        }

    };

    const signUp = async (first_name, last_name, email, phone, password) => {
        setLoading(true);
        setError(null);
        setStatus(null);
        try {

            const response = await api.post('api/v1/auth/register/', {
                first_name,
                last_name,
                email,
                phone,
                password,
            });

            setStatus(response.status);
            return response

        } catch (err) {
            setStatus(err.response?.data?.status);
            console.error('Login error:', err.response?.data || err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
            // resetForm();
        }
    }

    return { login, signUp, loading, error, status };

}