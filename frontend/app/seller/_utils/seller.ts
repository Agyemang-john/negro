
interface TruncateProp {
    text: string;
    maxLength: number;
}




export const truncateText = ({ text, maxLength}: TruncateProp) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
};

export const capitalizeEachWord = (text: string) => {
    return text.split(' ')
               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
               .join(' ');
};


export const formatNumber = (number: number) => {
    if (number >= 1_000_000) {
        return (number / 1_000_000).toFixed(1) + "M";
    } else if (number >= 1_000) {
        return (number / 1_000).toFixed(1) + "K";
    }
    return number.toString();
};
  
