import React  from 'react';
import SplitItemCard from './SplitItemCard';

function SplitList({ splits, 
  userId, 
  type,
   onUpdate 
  }) {



  return (
    <div className="split-list">
      {splits?.length === 0 ? (
        <p>No splits found</p>
      ) : (
          <div className='splitcard'>
            {
              splits?.map((splitItem) => {
                console.log(splitItem)
                return(
                  <SplitItemCard splitItem={splitItem} userId={userId} type={type} onUpdate={onUpdate}/>
                )
              })
            }
          </div>
      )}
    </div>
  );
}

export default SplitList;