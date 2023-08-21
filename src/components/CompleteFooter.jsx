import Form from 'react-bootstrap/Form';
import CustomButton from "./customButton";
import { useTranslation } from "react-i18next";

const CompleteFooter = ({
    newText,
    resetFormCallback,
    copyStatus,
    copyFunc
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Form.Group className="d-flex justify-content-center align-items-center pt-3 pb-3 w-100"
                style={{'minWidth':'350px'}}
            >
                <CustomButton type="button" text={t(newText)} onClick={resetFormCallback} />
                <CustomButton type="button" text={t(copyStatus)} className="bg-white" onClick={copyFunc} />
            </Form.Group>
        </>
    );
}

export default CompleteFooter;