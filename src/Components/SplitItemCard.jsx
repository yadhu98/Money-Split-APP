import React, { useState } from 'react'
import Decimal from 'decimal.js';
import { updateSplitPayment } from '../utils/storage';

const SplitItemCard = ({ splitItem, userId, type, onUpdate }) => {
    const [paymentAmounts, setPaymentAmounts] = useState({});

    const handlePaymentChange = (splitId, amount) => {
        setPaymentAmounts({
            ...paymentAmounts,
            [splitId]: amount,
        });
    };

    const handlePaymentSubmit = (split) => {
        const amount = parseFloat(paymentAmounts[split.id] || 0);
        console.log(amount)
            updateSplitPayment(split.id, userId, amount);
            onUpdate();
            setPaymentAmounts({
                ...paymentAmounts,
                [split.id]: '',
            });
    };
    console.log("splitItem", splitItem)

    function isGreater(a, b) {
        return new Decimal(a).greaterThan(b);
    }

    const isPaid = (id) => {
        let isPaidCompletely = true
        console.log("id", id, splitItem.payments)
        const userrr = splitItem.payments.find((user) => user.userId === id)
        if(!userrr){
            isPaidCompletely = false
        }
        const amountTobepaid = splitItem.shares.find((user) => user.userId === id)
        if (userrr && amountTobepaid) {
            if (isGreater(amountTobepaid?.amount, userrr?.amount)) {
                isPaidCompletely = false
            }
        }

        return isPaidCompletely
    }

    console.log("Payment",paymentAmounts)
    return (
        <div key={splitItem.id} className='split-card-item'>
            <h3>{splitItem.description}</h3>
            <div className='users-split-main'>
                <table className='users-in-split'>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Paid</th>
                    </tr>
                    {
                        splitItem?.shares?.map((sharedUsers) => {
                            const isPaidFlag = isPaid(sharedUsers.userId)
                            return (
                                <tr className='table-content'>
                                    <td>{sharedUsers?.userName}</td>
                                    <td>₹{sharedUsers?.amount.toFixed(2)}</td>
                                    <td>
                                        {isPaidFlag ? 'Fully Paid' : 'Not Fully Paid'}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>
                <p>Paid: ₹{(splitItem.payments.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}</p>
            </div>
            {
                type === 'owed' &&
                <div>
                    <div className="payment-section">
                        <input
                            type="number"
                            placeholder="Payment amount"
                            value={paymentAmounts[splitItem.id] || ''}
                            onChange={(e) => handlePaymentChange(splitItem.id, e.target.value)}
                            min="0"
                            step="0.01"
                        />
                        <button onClick={() => handlePaymentSubmit(splitItem)}>Pay</button>
                    </div>
                </div>
            }

        </div>
    )
}

export default SplitItemCard