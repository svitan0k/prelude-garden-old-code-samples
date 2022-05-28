import React, { useEffect } from 'react'
import { v4 as uuid } from 'uuid';

function SliderCheckbox({checkboxId, checkedState, changeStateFunc}) {
    
    function toggleCheckbox() {
        changeStateFunc()
        document.getElementById(checkboxId).checked = !checkedState;
        if (document.getElementById(checkboxId).checked) {
            document.getElementById(`slider-body-${checkboxId}`).style.backgroundColor = '#006ce7'
            document.getElementById(`slider-circle-${checkboxId}`).style.right = '0'
        } else {
            document.getElementById(`slider-body-${checkboxId}`).style.backgroundColor = '#2D3142'
            document.getElementById(`slider-circle-${checkboxId}`).style.right = '60%'
        }
    }

    useEffect(() => {
        if (document.getElementById(checkboxId).checked) {
            document.getElementById(`slider-body-${checkboxId}`).style.backgroundColor = '#006ce7'
            document.getElementById(`slider-circle-${checkboxId}`).style.right = '0'
        } else {
            document.getElementById(`slider-body-${checkboxId}`).style.backgroundColor = '#2D3142'
            document.getElementById(`slider-circle-${checkboxId}`).style.right = '60%'
        }
    }, [])

    return (
        <div type='checkbox' className='slider-checkbox-container'>
            <input type='checkbox' id={checkboxId} defaultChecked={checkedState}/>
            <div className='slider-checkbox-body' id={`slider-body-${checkboxId}`} onClick={() => toggleCheckbox()}>
                <div className='slider-checkbox-circle' id={`slider-circle-${checkboxId}`}></div>
            </div>
        </div>
    )
}

export default SliderCheckbox