import React from 'react';
import './SlideShow.css';


const SlideShow = (props) => {
    
    const image = props.photoURL ? props.photoURL : null;
    console.log(image);
    return(
        <div className='slide-show-container'>
            <div className='slide-show-left' onClick={() => props.cyclePhotoSlideShow(-1)}>
                <p>Back</p>

            </div>
            <div className='slide-show-image'>
                <img src={image}/>

            </div>
            

            <div className='slide-show-right' onClick={() => props.cyclePhotoSlideShow(1)}>
                <p>Next</p>
            </div>
        

        </div>
    )
}

export default SlideShow;