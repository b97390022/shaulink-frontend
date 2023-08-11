import Image from 'react-bootstrap/Image';
import VisibilitySensor from 'react-visibility-sensor'

const ImageComponent = () => {

    return (
        <>
            <div>
                Image Page
                <VisibilitySensor>
                    <Image src="android-chrome-512x512.png" fluid />
                </VisibilitySensor>
            </div>
        </>
       
    )
};

export default ImageComponent;