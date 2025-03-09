
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth, finishInitialLoad } from '@/redux/features/authSlice';
import { useVerifyMutation } from '@/redux/features/authApiSlice';
import { useGetCartQuery } from '@/redux/productApi/cartApiSlice';

export default function useVerify() {
	useGetCartQuery();
	const dispatch = useAppDispatch();

	const [verify] = useVerifyMutation();

	useEffect(() => {
		verify(undefined)
			.unwrap()
			.then(() => {
				dispatch(setAuth());
				// useGetCartQuery();
			})
			.finally(() => {
				dispatch(finishInitialLoad());
			});
	}, []);
}
