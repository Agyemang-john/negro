import { useState } from 'react';
import Swal from 'sweetalert2';


export const useFollowToggle = (vendorSlug: string, initialIsFollowing: boolean, initialFollowerCount: number, isAuthenticated: boolean) => {
    const [ isFollowing, setIsFollowing ] = useState(initialIsFollowing);
    const [ followerCount, setFollowerCount ] = useState(initialFollowerCount);
    const [loading, setLoading] = useState(false);

    const handleFollowToggle = async () => {
        if (!isAuthenticated) {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "Login to follow Seller",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/v1/seller-detail/${vendorSlug}/`, {method: 'POST', credentials: 'include'});
            const data = await res.json();
            setIsFollowing(data.is_following);  // Update button state
            setFollowerCount(data.followers_count);
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setLoading(false)
        }
    }
    return { isFollowing, followerCount, loading, handleFollowToggle }
}