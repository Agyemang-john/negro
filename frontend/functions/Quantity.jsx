import React from 'react';

const QuantityCounter = ({ quantity, setQuantity }) => {
    const min = 1;
    const max = 20;

    // Handle increase button click
    const handleIncrease = () => {
        setQuantity(prevQuantity => {
            if (prevQuantity < max) {
                return prevQuantity + 1;
            }
            return prevQuantity;
        });
    };

    // Handle decrease button click
    const handleDecrease = () => {
        setQuantity(prevQuantity => {
            if (prevQuantity > min) {
                return prevQuantity - 1;
            }
            return prevQuantity;
        });
    };

    // Handle input value change
    const handleInputChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= min && value <= max) {
            setQuantity(value);
        }
    };

    return (
        <div className="input-counter">
            {/* Decrease button */}
            <span className="minus-button shadow-sm text-white" onClick={handleDecrease}>
                _
            </span>
            
            {/* Quantity input */}
            <input 
                className="quantity_total_" 
                id="quantity_total_" 
                type="text" 
                min={min} 
                max={max} 
                name="quantity" 
                value={quantity} 
                onChange={handleInputChange}
            />
            
            {/* Increase button */}
            <span className="plus-button shadow-sm text-white" onClick={handleIncrease}>
                +
            </span>
        </div>
    );
};

export default QuantityCounter;
