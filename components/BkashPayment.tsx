import React, { useState } from 'react';

const BkashPayment = ({ amount, orderId }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/bkash/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, orderId })
            });
            const data = await response.json();
            if (data.success) {
                // Handle payment success (e.g., redirect to bKash payment page)
                console.log('Payment created:', data);
            } else {
                alert('Payment creation failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handlePayment} 
            disabled={loading}
            className="bg-pink-600 text-white px-4 py-2 rounded"
        >
            {loading ? 'Processing...' : 'Pay with bKash'}
        </button>
    );
};

export default BkashPayment;
