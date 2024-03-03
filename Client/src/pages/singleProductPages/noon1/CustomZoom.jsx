import { ButtonBase } from "@mui/material"
import { useLayoutEffect, useState } from "react"
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
export const CustomZoomContent = ({
    buttonUnzoom,
    modalState,
    img,

}) => {
    const [isLoaded, setIsLoaded] = useState(false)

    useLayoutEffect(() => {
        if (modalState === 'LOADED') {
            setIsLoaded(true)
        } else if (modalState === 'UNLOADING') {
            setIsLoaded(false)
        }
    }, [modalState])

    const handleDownload = (img) => {
        const nameImg = img?.props.src.split('/').pop().split('.').shift();
        if (modalState === 'LOADED') {
            fetch(img?.props.src)
                .then((response) => response.blob())
                .then((blob) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = nameImg; // You can customize the downloaded file name here
                    // Append the link to the document body
                    document.body.appendChild(link);
                    // Trigger a click on the link to initiate the download
                    link.click();
                    // Remove the link from the document body
                    document.body.removeChild(link);
                })
                .catch((error) => {
                    console.error('Error fetching or creating Blob:', error);
                });
        }
    }

    return <>
        {buttonUnzoom}

        <figure>
            {img}
            <ButtonBase

                onClick={() => handleDownload(img)}
                sx={{
                    position: 'absolute',
                    top: '2%',
                    left: '4%',


                }}>
                <DownloadForOfflineIcon sx={{
                    fontSize: 45,
                }} />
            </ButtonBase>
        </figure>
    </>
}