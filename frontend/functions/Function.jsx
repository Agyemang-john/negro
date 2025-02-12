// Function.js
 // Import elevateZoom from @zeitiger package
import api from '../utils/api';

/**
 * Truncate a string to a specified length and add ellipsis if needed.
 *
 * @param {string} text - The string to be truncated.
 * @param {number} maxLength - The maximum length of the string before truncation.
 * @returns {string} The truncated string with ellipsis if applicable.
 */



// const useVariantChange = (slug, id, subCategorySlug) => {
//   const navigate = useNavigate();

//   const handleVariantChange = (newVariantId) => {
//     // Update the URL without refreshing the page
//     navigate(`/${slug}/${id}/${subCategorySlug}/?variantid=${newVariantId}`);
//   };

//   return handleVariantChange;
// };

// export default useVariantChange;
export const fetchVendorDetails = async (slug) => {
  try {
    const response = await api.get(`/vendor/${slug}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor data:", error);
    throw error;
  }
};

// const useVariantChange = (sku, slug) => {
//     const navigate = useNavigate();
//     const location = useLocation();
  
//     const handleVariantChange = async (newVariantId) => {
//       try {
//         // // Construct the new URL based on the current location, with the updated variantid
//         const searchParams = new URLSearchParams(location.search);
//         searchParams.set('variantid', newVariantId);
  
//         // Update the URL client-side without triggering a page refresh
//         navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
//       } catch (error) {
//         console.error('Error during variant change:', error);
//       }
//     };
  
//     return handleVariantChange;
//   };
  
//   export default useVariantChange;


export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

export const capitalizeEachWord = (text) => {
    return text.split(' ')
               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
               .join(' ');
  };
  
