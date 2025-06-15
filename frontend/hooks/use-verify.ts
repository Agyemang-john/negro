
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth, finishInitialLoad } from '@/redux/features/authSlice';
// import { useVerifyMutation } from '@/redux/features/authApiSlice';
import { useVerifyMutation, useRefreshMutation } from '@/redux/features/authApiSlice';
import { useGetCartQuery } from '@/redux/productApi/cartApiSlice';

export default function useVerify() {
	// useGetCartQuery();
	const dispatch = useAppDispatch();

	const [verify] = useVerifyMutation();
	const [refresh] = useRefreshMutation();

	useEffect(() => {
		const runVerification = async () => {
			try {
				await verify(undefined).unwrap();
				dispatch(setAuth());
			} catch (err) {
				// Attempt refresh on verify failure
				try {
					await refresh(undefined).unwrap();
					// If refresh works, retry verify
					await verify(undefined).unwrap();
					dispatch(setAuth());
				} catch (refreshErr) {
					// Refresh also failed — user is not authenticated
					console.warn("Token refresh failed", refreshErr);
				}
			} finally {
				dispatch(finishInitialLoad());
			}
		};

		runVerification();
	}, []);
}
