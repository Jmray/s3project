import React, {useState, useEffect} from 'react';
import AWS from 'aws-sdk';
import './Dashboard.css';
import SlideShow from './SlideShow';


const Dashboard = (props) => {

    
    const [photos, handleAddPhoto] = useState([]);
    const [photoToUpload, handlePhotoChange] = useState({});
    const [uploadIsActive, handleUploadFlagChange] = useState(true);
    const [currentPhotoInSlideShow, handlePhotoInSlideShowChange] = useState(0);
    
    useEffect(() => {
        getPhotosS3();
      }, []);
    
    const bucketName = "jmr-bucket";
    const bucketLocation ="https://jmr-bucket.s3.us-east-2.amazonaws.com/"
    const bucketRegion = "us-east-2";
    const identityPoolId = "us-east-2:8c06cedd-750b-482e-9d58-779918fc1c0a";

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
  })
});



    const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    });

    
    const getPhotosS3 = () => {
        s3.listObjects({Bucket: bucketName}, (err, data) => {
            if(err){
                return alert(err.message);
            }
            let tempPhotos = [];
            for(let photo in data.Contents){
                const photoURL = bucketLocation + data.Contents[photo].Key;
                tempPhotos.push({
                    photoURL,
                    key: data.Contents[photo].Key
                })

            }
                    handleAddPhoto( photos => {
                        return tempPhotos;
                    });
        })
    }
    const uploadPhotoS3 = (photoFile) => {
        const upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: bucketName,
                Key: photoFile.name,
                Body: photoFile,
                ACL: "public-read"
            }
        })
        const promise = upload.promise();

        promise.then(
            function(data) {
            alert("Successfully uploaded photo.");
            getPhotosS3();
            },
            function(err) {
            return alert("There was an error uploading your photo: ", err.message);
            }
        );

    }
    const deletePhotoS3 = (key) => {
        s3.deleteObject({Bucket: bucketName, Key: key}, (err, data) => {
            if(err){console.log(err, err.stack)}
            else{
                if(currentPhotoInSlideShow != 0){
                    handlePhotoInSlideShowChange(currentPhotoInSlideShow - 1)

                } 
                getPhotosS3(); 
            }
        });
    }

    const cyclePhotoSlideShow = (upOrDown) => {
        if(currentPhotoInSlideShow >= photos.length-1 && upOrDown === 1){
            handlePhotoInSlideShowChange(0);
            return;
        }
        else if(currentPhotoInSlideShow === 0 && upOrDown === -1){
            handlePhotoInSlideShowChange(photos.length-1)
            return;
        }
        else{

            handlePhotoInSlideShowChange(currentPhotoInSlideShow + upOrDown)
        }
    }
    const deleteButton = photos[0] ? <button onClick={() => deletePhotoS3(photos[currentPhotoInSlideShow].key)}>delete</button> : <p>No Photos</p>;
    return(
        
        <div className='dashboard-container'>
            {console.log(currentPhotoInSlideShow)}
            <div>
                <input onChange={event => {
                    handlePhotoChange(event.target.files)
                    handleUploadFlagChange(false)
                    }} type='file'/>
                <button disabled={uploadIsActive} onClick={() => uploadPhotoS3(photoToUpload[0])}>Upload</button>
                {deleteButton}
            </div>
            <div>
                
                <SlideShow 
                    photoURL={photos[0] ? photos[currentPhotoInSlideShow].photoURL : null}
                    cyclePhotoSlideShow={cyclePhotoSlideShow}
                />
            </div>

            
            
        </div>
    )
};

export default Dashboard;
