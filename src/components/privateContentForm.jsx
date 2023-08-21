import React from "react";
import Form from 'react-bootstrap/Form';
import * as formik from 'formik';
import * as yup from 'yup';
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../Theme";
import CustomButton from "./customButton";
import Swal from 'sweetalert2';

const PrivateContentForm = ( { hash, password, setIsCorrect } ) => {
    const { Formik } = formik;
    const { theme } = React.useContext(ThemeContext);
    const { t } = useTranslation();

    const schema = yup.object().shape({
        password: yup.string(),
    });
    const submitUrlHandler = (values) => {
        const submitPassword = values["password"];
        if (submitPassword === password) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
            Swal.fire({
                title: t('Warning'),
                html: `${t("Password error! please try again.")}`,
                confirmButtonText: t('OK'),
                confirmButtonColor: '#0dcaf0'
            });
        }
    }


    return (
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
                <Form noValidate className='my-auto d-flex flex-column justify-content-center align-items-center w-100' onSubmit={handleSubmit} style={{'maxWidth': '600px'}}>
                    <Form.Group className="mb-3 w-100" controlId="urlInput"
                        style={{'minWidth':'350px'}}
                    >
                        <Form.Control
                            type="input"
                            name="password"
                            className={`rounded-pill border border-3 border-${theme === "dark" ? "light" : "dark"} fs-4`}
                            placeholder={t("Password")}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid" className='ps-2'>
                            {t(errors.password)}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <CustomButton type="submit" text={t("Enter")}/>
                </Form>
            )}
        </Formik>
    )
}

export default PrivateContentForm;