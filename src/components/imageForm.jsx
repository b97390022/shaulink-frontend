import axios from 'axios';
import React from "react";
import CustomButton from "./customButton";
import CompleteFooter from "./CompleteFooter";
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import { ConfigContext } from '../config';
import { createShortId } from '../utils/functions';
import { ThemeContext } from "../Theme";
import fh from '../utils/fetch'
import { useTranslation } from "react-i18next";
import * as formik from 'formik';
import * as yup from 'yup';
import copy from "copy-to-clipboard";
import { QRCodeCanvas } from "qrcode.react";
import { downloadQRCode } from '../utils/functions';

// pintura
import "@pqina/pintura/pintura.css";
import {
  // editor
  openEditor,
  locale_en_gb,
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultImageOrienter,
  createDefaultShapePreprocessor,
  legacyDataToImageState,
  processImage,

  // plugins
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_finetune,
  plugin_finetune_locale_en_gb,
  plugin_finetune_defaults,
  plugin_filter,
  plugin_filter_locale_en_gb,
  plugin_filter_defaults,
  plugin_annotate,
  plugin_annotate_locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
} from "@pqina/pintura";

import {
    LocaleCore,
    LocaleCrop,
    LocaleFinetune,
    LocaleFilter,
    LocaleAnnotate,
    LocaleMarkupEditor,
} from '@pqina/pintura/locale/zh_CN';

// filepond
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import en_en from 'filepond/locale/en-en';
import zh_TW from 'filepond/locale/zh-tw.js';

import { FilePond, registerPlugin } from 'react-filepond'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginImageEditor from '@pqina/filepond-plugin-image-editor';
// Register the filepond plugin
registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginFilePoster,
    FilePondPluginImageEditor
)

const locale_en = {
    "filepond": en_en,
    "filepondEditor": {
        "LocaleCore": locale_en_gb,
        "LocaleCrop": plugin_crop_locale_en_gb,
        "LocaleFinetune": plugin_finetune_locale_en_gb,
        "LocaleFilter": plugin_filter_locale_en_gb,
        "LocaleAnnotate": plugin_annotate_locale_en_gb,
        "LocaleMarkupEditor": markup_editor_locale_en_gb
    }
}
const locale_zh_TW = {
    "filepond": zh_TW,
    "filepondEditor": {
        "LocaleCore": LocaleCore,
        "LocaleCrop": LocaleCrop,
        "LocaleFinetune": LocaleFinetune,
        "LocaleFilter": LocaleFilter,
        "LocaleAnnotate": LocaleAnnotate,
        "LocaleMarkupEditor": LocaleMarkupEditor
    },
}

// Register the pintura plugin
setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);


const ImageFormComponent = () => {
    const { config } = React.useContext(ConfigContext);
    const { theme } = React.useContext(ThemeContext);
    const { t } = useTranslation();
    const formRef = React.useRef();
    const [ formID, setFormID ]= React.useState(createShortId());
    const fileRef = React.useRef();
    const [ password, setPassword ] = React.useState("");
    const [ files, setFiles ] = React.useState([]);
    const [ fileState, setFileState ] = React.useState({}) // id:precessing,done,error
    const [ fileValidated, setFileValidated ] = React.useState(false);
    const [ uploadingState, setUploadingState ] = React.useState('waitingForUpload'); // waitingForUpload、processing、complete
    const [ shortUrl, setShortUrl ] = React.useState("");
    const { Formik, ErrorMessage } = formik;
    const acceptedFileTypes = ['image/jpeg', 'image/png'];
    const [ qrValue, setQrValue ] = React.useState('');
    const qrRef = React.useRef(null);
    const inputUrlRef = React.useRef(null);
    const [ copyBtnText, setCopyBtnText ] = React.useState("Copy");
    const [ timerId, setTimerID ] = React.useState(null);
    const [ locale, setLocale ] = React.useState(locale_en);

    const resetForm = () => {
        setShortUrl('');
        setPassword('');
        setFiles([]);
        setFileState({});
        setFileValidated(false);
        setUploadingState('waitingForUpload')
        fileRef.current.removeFiles();
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

    const createFilePond = () => {
        const { filepond, filepondEditor } = locale;
        return <FilePond
            {...filepond}
            files={files}
            filePosterMaxHeight={256}
            chunkUploads={false}
            allowProcess={false}
            allowRevert={false}
            allowPaste={uploadingState === "waitingForUpload"}
            allowDrop={uploadingState === "waitingForUpload"}
            allowBrowse={uploadingState === "waitingForUpload"}
            instantUpload={false}
            onupdatefiles={fileUpdateHandler}
            onprocessfile={uploadComplete}
            allowMultiple={true}
            maxFiles={5}
            maxParallelUploads={5}
            storeAsFile={false}
            checkValidity={true}
            name="files" /* sets the file input name, it's filepond by default */
            credits={false}
            acceptedFileTypes={acceptedFileTypes}
            allowFileSizeValidation={true}
            maxFileSize="15MB"
            allowImagePreview={true}
            allowImageResize={true}
            allowImageEdit={true}
            styleImageEditButtonEditItemPosition={"buttom"}
            server={{
                process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                    const formData = new FormData();
                    formData.append(fieldName, file, file.name);
                    formData.append("formId", formID);
                    formData.append("password", password);
                    formData.append("media_type", file.type);
    
                    const request = new window.XMLHttpRequest()
                    request.open('POST', `${config.backendUrl}/image`)
                    const thisHeaders = fh.addToken({})
                    for (const key in thisHeaders) request.setRequestHeader(key, thisHeaders[key])
    
                    request.upload.onprogress = (e) => {
                        progress(e.lengthComputable, e.loaded, e.total)
                    }
    
                    request.onload = function () {
                    if (request.status >= 200 && request.status < 300) {
                        load(request.responseText)
                    } else {
                        const errMssg = (JSON.parse(request.responseText)).error
                        error(errMssg)
                    }
                    }
    
                    request.send(formData);
    
                    // Should expose an abort method so the request can be cancelled
                    return {
                        abort: () => {
                            // This function is entered if the user has tapped the cancel button
                            request.abort();
    
                            // Let FilePond know the request has been cancelled
                            abort();
                        }
                    }
                },
                fetch: null,
                revert: null
            }}
            imageEditor={{
                // map legacy data objects to new imageState objects
                legacyDataToImageState: legacyDataToImageState,
    
                // used to create the editor, receives editor configuration, should return an editor instance
                createEditor: openEditor,
    
                // Required, used for reading the image data
                imageReader: [
                createDefaultImageReader,
                {
                    /* optional image reader options here */
                },
                ],
    
                // optionally. can leave out when not generating a preview thumbnail and/or output image
                imageWriter: [
                createDefaultImageWriter,
                {
                    /* optional image writer options here */
                },
                ],
    
                // used to generate poster images, runs an editor in the background
                imageProcessor: processImage,
    
                // editor options
                editorOptions: {
                    utils: ["crop", "finetune", "filter", "annotate"],
                    imageOrienter: createDefaultImageOrienter(),
                    shapePreprocessor: createDefaultShapePreprocessor(),
                    ...plugin_finetune_defaults,
                    ...plugin_filter_defaults,
                    ...markup_editor_defaults,
                    locale: {
                        ...filepondEditor.LocaleCore,
                        ...filepondEditor.LocaleCrop,
                        ...filepondEditor.LocaleFinetune,
                        ...filepondEditor.LocaleFilter,
                        ...filepondEditor.LocaleAnnotate,
                        ...filepondEditor.LocaleMarkupEditor,
                    },
                },
            }}
            ref={fileRef}
        />
    }

    React.useEffect(() => {
        switch (window.localStorage.getItem('i18nextLng')) {
            case 'zh':
                setLocale(locale_zh_TW);
                return
            case 'en':
                setLocale(locale_en);
                return
        }
    }, [t])

    React.useEffect(() => {
        if (fileRef && fileRef.current && uploadingState === 'processing') fileRef.current.processFiles()
    }, [uploadingState])

    React.useEffect(() => {
        if (Object.keys(fileState).length === 0) return;

        let isUploadComplete = true;
        for (const [key, value] of Object.entries(fileState)) {
            if (value === 'processing') {
                isUploadComplete = false;
                break;
            }
        }
        if (isUploadComplete) {
            setUploadingState('complete');
            setFormID(createShortId());
        }
    }, [fileState])

    const schema = yup.object().shape({
        password: yup.string(),
        files: yup.mixed().required(
            "Please upload at least one image!"
        ),
    });

    const fileUpdateHandler = (files) => {
        setFiles(files);
        if (files.length === 0) {
            setFileValidated(false);
        } else {
            setFileValidated(true);
        }
    }
    const submitUrlHandler = async (values) => {
        const newFileState = {};
        fileRef.current.getFiles().forEach(item => {
            newFileState[item.id] = 'processing';
        });
        setFileState(newFileState);
        setUploadingState('processing');
    }

    const uploadComplete = (error, file) => {
        const fileId = file.id;
        if (error) {
            Swal.fire({
                title: t('Warning'),
                html: `<b>${error.response.status}</b> - ${t("Oops,something went wrong! Please try again later.")}`,
                confirmButtonText: t('OK'),
                confirmButtonColor: '#0dcaf0'
            });
            setFileState(prevState => {
                const newList = {
                    [fileId]: "complete"
                };
                return {...prevState, ...newList}
            })
            return;
        };
        const respVal = JSON.parse(file.serverId);
        if (respVal.data) {
            setFileState(prevState => {
                const newObj = {
                    [fileId]: "complete"
                };
                return {...prevState, ...newObj}
            });
            setShortUrl(respVal.data.shortUrl);
            setQrValue(respVal.data.shortUrl);
        }
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                onSubmit={submitUrlHandler}
                initialValues={{
                    password: '',
                    files: '',
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <Form ref={formRef} noValidate className='d-flex flex-column justify-content-center align-items-center w-100' onSubmit={handleSubmit}>
                        <Form.Group className="w-100 mb-2">
                            {
                                createFilePond()
                            }
                            <div className={`${fileValidated ? '' : 'is-invalid'}`}></div>
                            <ErrorMessage name="files">
                                {(msg) => <div className="ps-2 invalid-feedback">{t(msg)}</div>}
                            </ErrorMessage>
                        </Form.Group>
                        {
                            uploadingState === "waitingForUpload" ?
                            <>
                                <Form.Floating className="w-100 mb-3">
                                    <Form.Control
                                        id="floatingPasswordCustom"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        className={`rounded-pill border border-3 border-${theme === "dark" ? "light" : "dark"} fs-4`}
                                        onChange={(e)=>{
                                            handleChange(e);
                                            setPassword(e.target.value);
                                        }}
                                        autoComplete="on"
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid" className='ps-2'>
                                        {t(errors.password)}
                                    </Form.Control.Feedback>
                                    <label className="ms-1" htmlFor="floatingPasswordCustom">{t('Password')}</label>
                                </Form.Floating>
                                <CustomButton type="submit" text={t("Shorten")} disabled={isSubmitting} onClick={() => {
                                    if (files.length > 0) {
                                        setFileValidated(true);
                                        setFieldValue("files", 'true');
                                    } else {
                                        setFileValidated(false);
                                        setFieldValue("files", '');
                                    }
                                }}/>
                            </>
                            : <>
                                {
                                    uploadingState === "complete"
                                    ? 
                                    <>
                                        <div className='mb-3' ref={qrRef} >
                                            <QRCodeCanvas id="qr-code" level={"L"} value={qrValue} onClick={()=>{
                                                downloadQRCode(
                                                    qrRef.current.querySelector('canvas'),
                                                    qrValue
                                                )
                                            }}/>
                                        </div>
                                        <Form.Group className="mb-3 w-100" controlId="urlInput"
                                            style={{'minWidth':'350px'}}
                                        >
                                            <Form.Control
                                                type="input"
                                                ref={inputUrlRef}
                                                name="shortUrl"
                                                onChange={handleChange}
                                                value={shortUrl !== "" ? (process.env.NODE_ENV === "production" ? shortUrl : shortUrl.replace('http://localhost', config.frontendUrl)) : values.longUrl}
                                                className={`rounded-pill border border-3 border-${theme === "dark" ? "light" : "dark"} fs-4`}
                                            />
                                        </Form.Group>
                                        <CompleteFooter 
                                            newText={"New Image!"}
                                            resetFormCallback={resetForm}
                                            copyStatus={copyBtnText}
                                            copyFunc={copyToClipboard}
                                        />
                                    </> 
                                    : <div className='lds-dual-ring'></div>
                                }
                            </>
                        }
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default ImageFormComponent;