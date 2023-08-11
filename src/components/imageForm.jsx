import React from "react";
import CustomButton from "./customButton";
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import { ThemeContext } from "../Theme";
import { useTranslation } from "react-i18next";
import * as formik from 'formik';
import * as yup from 'yup';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize, FilePondPluginImageExifOrientation, FilePondPluginImagePreview)


const ImageFormComponent = () => {
    const { theme } = React.useContext(ThemeContext);
    const { t } = useTranslation();
    const [ validated, setValidated ] = React.useState(false);
    const [ fileValidated, setFileValidated ] = React.useState(false);
    const [ files, setFiles ] = React.useState([]);
    const [ isloading, setIsLoading] = React.useState(false);
    const { Formik } = formik;
    const acceptedFileTypes = ['image/jpeg', 'image/png'];

    const schema = yup.object().shape({
        password: yup.string(),
    });
    const fileUpdateHandler = (files) => {
        setFiles(files);
        
        if (files.length === 0) {
            setFileValidated(false);
            setValidated(false);
        } else {
            setFileValidated(true);
        }
        
    }

    const submitUrlHandler = (values) => {
        setIsLoading(true);
        if (fileValidated === false) {
            setValidated(false);
            Swal.fire({
                title: t('Warning'),
                html: `${t("Images required!")}`,
                confirmButtonText: t('OK'),
                confirmButtonColor: '#0dcaf0'
            });
            return;
        }
        
        console.dir(values)
        console.log(files)
        // const fetchData = async (url) => {
        //     try {
        //         const response = await axios.post(
        //             process.env.NODE_ENV === "production" ? `/api/v1/shorten/` : `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/v1/shorten/`,
        //             {
        //                 "url": url
        //             }
        //         );
                
        //         if (response.status === 200) {
        //             setShortUrl(response.data);
        //             setMain(false);
        //         };
        //         setMain(false);

        //     } catch (error) {
        //         if (error.response?.status === 404 || error.response?.status === 500) {
        //             Swal.fire({
        //                 title: t('Warning'),
        //                 html: `<b>${error.response.status}</b> - ${t("Oops,something went wrong! Please try again later.")}`,
        //                 confirmButtonText: t('OK'),
        //                 confirmButtonColor: '#0dcaf0'
        //             });
        //         };
        //         setShortUrl("");
        //         // console.error('Error fetching data:', error);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };
        // fetchData(longUrl);
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                onSubmit={submitUrlHandler}
                initialValues={{
                    password: '',
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
                    <Form noValidate validated={validated} className='d-flex flex-column justify-content-center align-items-center w-100' onSubmit={handleSubmit}>
                        <Form.Group className="w-100">
                            <FilePond
                                files={files}
                                allowProcess={false}
                                instantUpload={false}
                                onupdatefiles={fileUpdateHandler}
                                allowMultiple={false}
                                maxFiles={1}
                                storeAsFile={false}
                                name="files" /* sets the file input name, it's filepond by default */
                                labelIdle={`${t('Drag & Drop your files or')} <span class="filepond--label-action">${t('Browse')}</span>`}
                                credits={false}
                                acceptedFileTypes={acceptedFileTypes}
                                allowFileSizeValidation={true}
                                maxFileSize="3KB"
                            />
                        </Form.Group>
                        <Form.Floating className="w-100 mb-3">
                            <Form.Control
                                id="floatingPasswordCustom"
                                name="password"
                                type="password"
                                placeholder="Password"
                                className={`rounded-pill border border-3 border-${theme === "dark" ? "light" : "dark"} fs-4`}
                                onChange={handleChange}
                                autoComplete="on"
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid" className='ps-2'>
                                {t(errors.password)}
                            </Form.Control.Feedback>
                            <label className="ms-1" htmlFor="floatingPasswordCustom">{t('Password')}</label>
                        </Form.Floating>
                        <CustomButton type="submit" text={t("Shorten")}/>                     
                    </Form>
                )}
            </Formik>
        </>
        
        
    )

}

export default ImageFormComponent;