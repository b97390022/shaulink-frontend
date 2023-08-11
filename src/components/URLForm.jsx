import React from 'react';
import CustomButton from "./customButton";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import * as formik from 'formik';
import * as yup from 'yup';
import copy from "copy-to-clipboard";
import Swal from 'sweetalert2';
import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../Theme";
import { Button } from 'react-bootstrap';

const URLFormComponent = () => {
    const { theme } = React.useContext(ThemeContext);
    const { t } = useTranslation();
    const [ qrValue, setQrValue ] = React.useState('');
    const { Formik } = formik;
    const inputUrlRef = React.useRef(null);
    const [ main, setMain ] = React.useState(true);
    const [ isloading, setIsLoading] = React.useState(false);
    const [ shortUrl, setShortUrl ] = React.useState('');
    const [ copyBtnText, setCopyBtnText ] = React.useState("Copy");
    const [ timerId, setTimerID ] = React.useState(null);
    

    const schema = yup.object().shape({
        longUrl: yup.string().url(
            "Please enter the correct URL!"
        ).required(
            "Please enter URL!"
        ),
    });

    const resetForm = () => {
        setMain(true);
        setShortUrl('');
    }

    const copyToClipboard = () => {
        inputUrlRef.current.select();
        const copyText = document.getElementById('urlInput').value;
        copy(copyText);
        setCopyBtnText("Copied!");
        clearTimeout(timerId);

        setTimerID(setTimeout(()=>{
            setCopyBtnText("Copy");
        }, 800));
    };

    const downloadQRCode = () => {
        const canvas = document.getElementById("qr-code");
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${qrValue.split('/').pop()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const submitUrlHandler = (values) => {
        if (main === true) {
            setIsLoading(true);
            const longUrl = values["longUrl"];
            
            const fetchData = async (url) => {
                try {
                    const response = await axios.post(
                        process.env.NODE_ENV === "production" ? `/api/v1/shorten/` : `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/v1/shorten/`,
                        {
                            "url": url
                        }
                    );
                    
                    if (response.status === 200) {
                        setShortUrl(response.data);
                        setQrValue(response.data);
                        setMain(false);
                    };
                    setMain(false);

                } catch (error) {
                    if (error.response?.status === 404 || error.response?.status === 500) {
                        Swal.fire({
                            title: t('Warning'),
                            html: `<b>${error.response.status}</b> - ${t("Oops,something went wrong! Please try again later.")}`,
                            confirmButtonText: t('OK'),
                            confirmButtonColor: '#0dcaf0'
                        });
                    };
                    setShortUrl("");
                    // console.error('Error fetching data:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData(longUrl);
            
        }
    }

    return (
        <>
            {
                isloading ? <div className='lds-dual-ring'></div> : 
                <Formik
                    validationSchema={schema}
                    onSubmit={submitUrlHandler}
                    initialValues={{
                        longUrl: '',
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                    }) => (
                        <Form noValidate className='d-flex flex-column justify-content-center align-items-center w-100' onSubmit={handleSubmit}>
                            {
                                main === false
                                ? (
                                    <>
                                        <div className='mb-3'>
                                            <QRCodeCanvas id="qr-code" level={"L"} value={qrValue} onClick={downloadQRCode}/>
                                        </div>
                                        <Form.Group className="mb-3 w-100" controlId="urlInput"
                                            style={{'minWidth':'350px'}}
                                        >
                                            <Form.Control
                                                type="input"
                                                ref={inputUrlRef}
                                                name="shortUrl"
                                                onChange={handleChange}
                                                value={shortUrl !== "" ? (process.env.NODE_ENV === "production" ? shortUrl : shortUrl.replace('http://localhost', `http://localhost:${process.env.REACT_APP_FRONTEND_PORT}`)) : values.longUrl}
                                                className={`rounded-pill border border-3 border-${theme === "dark" ? "light" : "dark"} fs-4`}
                                            />
                                        </Form.Group>
                                    </>
                                )
                                : (<></>)
                            }
                            
                            { 
                                main === true
                                ? (
                                    <>
                                        <Form.Group className="mb-3 w-100" controlId="urlInput"
                                            style={{'minWidth':'350px'}}
                                        >
                                            <Form.Control
                                                type="input"
                                                name="longUrl"
                                                value={shortUrl !== "" ? shortUrl : values.longUrl}
                                                className={`rounded-pill border border-3 border-${theme === "dark" ? "light" : "dark"} fs-4`}
                                                placeholder="https://"
                                                onChange={handleChange}
                                                isInvalid={!!errors.longUrl}
                                            />
                                            <Form.Control.Feedback type="invalid" className='ps-2'>
                                                {t(errors.longUrl)}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label="打勾勾" />
                                        </Form.Group>
                                        <CustomButton type="submit" text={t("Shorten")}/>
                                    </>
                                )
                                : (
                                    <>
                                        <Form.Group className="d-flex justify-content-center align-items-center pt-3 pb-3 w-100"
                                            style={{'minWidth':'350px'}}
                                        >
                                            <CustomButton type="button" text={t("New URL")} onClick={resetForm} />
                                            <CustomButton type="button" text={t(copyBtnText)} className="bg-white" onClick={copyToClipboard} />
                                        </Form.Group>
                                    </>
                                )
                            }
                        </Form>
                    )}
                </Formik>
            }
        
        </>
        
      );
};

export default URLFormComponent;