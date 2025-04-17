const STORAGE_KEY = 'splitAppData';

let splits = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

export function getSplitsForUser(userId) {
  const owed = splits.filter(split => 
    split.shares.some(share => share.userId === userId) &&
    split.creatorId !== userId
  ).map(split => {
    const userShare = split.shares.find(share => share.userId === userId);
    const paid = split.payments.reduce((sum, p) => sum + (p.userId === userId ? p.amount : 0), 0);
    console.log(userShare,paid)
    return {
      ...split,
      remaining: userShare.amount - paid,
    };
  });
  console.log(splits)
  const owedTo = splits.filter(split => 
    split.creatorId === userId
  ).map(split => {
    console.log("splity",split)
    const payments = split.payments.reduce((acc, p) => {
      if (!acc[p.userId]) {
        acc[p.userId] = 0;
      }
      acc[p.userId] += p.amount;
      return acc;
    }, {});

    return {
      ...split,
      shares: split.shares.map(share => {
        const paid = payments[share.userId] || 0;
        return {
          ...share,
          paid,
          remaining: share.amount - paid,
        };
      }),
    };
  });

  return { owed, owedTo };
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