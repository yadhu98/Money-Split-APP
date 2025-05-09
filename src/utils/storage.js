const STORAGE_KEY = 'splitAppData';

let splits = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

export function getSplitsForUser(userId) {
    console.log("splituser " ,userId);
    const userOwes = getUserOwesSplits(userId);
    const othersOweUser = getOthersOweSplits(userId);
    return {
      owed: userOwes,
      owedTo: othersOweUser
    };
  }
  
  function getUserOwesSplits(userId) {
    console.log("this splits",splits)
   const filteredSplit = splits
      .filter(split => {
        const isSharing = split.shares.some(share => share.userId === userId);
        const notCreator = split.creatorId !== userId;
        return isSharing && notCreator;
      })
      console.log('filt',filteredSplit)
      const mappedFilteredSplit = filteredSplit.map(split => {
        const userPart = split.shares.find(share => share.userId === userId);
        const paidSoFar = getTotalPaid(split.payments, userId);
        
        console.log("User owes",userPart.amount - paidSoFar ,split.id);
        
        return {
          ...split,
          remaining: userPart.amount - paidSoFar
        };
      });
      console.log("mapped Filtered",mappedFilteredSplit)
      return mappedFilteredSplit
  }
  
  function getOthersOweSplits(userId) {
    const filteredSplits =  splits.filter(split => split.creatorId === userId)
     console.log("filteredSplitsOthersOwe",filteredSplits)
     const mappedFilterSplitOtherOwe = filteredSplits.map(split => {
        const whoPaidWhat = getPaymentSummary(split.payments);
        
        console.log("payments", whoPaidWhat);
        
        return {
          ...split,
          shares: split.shares.map(share => ({
            ...share,
            paid: whoPaidWhat[share.userId] || 0,
            remaining: share.amount - (whoPaidWhat[share.userId] || 0)
          }))
        };
      });
      console.log("mapped Filtered Split Other owe",mappedFilterSplitOtherOwe)
      return mappedFilterSplitOtherOwe
  }
  
  function getTotalPaid(payments, userId) {
    let total = 0;
    for (const payment of payments) {
      if (payment.userId === userId) {
        total += payment.amount;
      }
    }
    return total;
  }
  
  function getPaymentSummary(payments) {
    const summary = {};
    for (const payment of payments) {
      if (!summary[payment.userId]) {
        summary[payment.userId] = 0;
      }
      summary[payment.userId] += payment.amount;
    }
    return summary;
  }

export function addSplit(newSplit) {
  splits = [...splits, newSplit];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(splits));
}

export function updateSplitPayment(splitId, userId, amount) {
  splits = splits.map(split => {
    if (split.id === splitId) {
      return {
        ...split,
        payments: [...split.payments, { userId, amount }],
      };
    }
    return split;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(splits));
}