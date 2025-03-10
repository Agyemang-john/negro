"use client";


import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import api from './api';

const useUserData = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                const userId = decodedToken.user_id;
                const fetchUserData = async () => {
                    try {
                        const response = await api.get(`/api/user/${userId}/`,);

                        setUserData(response.data);
                        setLoading(false);
                    } catch (error) {
                        setError('Failed to load user data');
                        setLoading(false);
                    }
                };

                fetchUserData();
            } catch (e) {
                setError('Invalid token');
                setLoading(false);
            }
        } else {
            setError('No access token found');
            setLoading(false);
        }
    }, []);

    return { userData, loading, error };
};

export default useUserData;
