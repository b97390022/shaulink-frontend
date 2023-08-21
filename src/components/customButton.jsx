import Button from 'react-bootstrap/Button';

const CustomButton = (props) => {

    const {
        type,
        text,
        className,
        onClick,
        disabled
    } = props;

    return (
        <>
            <style type="text/css">
                {`
                    .btn-normal {
                        width: 160px;
                        font-size: 1.2rem;
                        margin: 0 2px;
                    }
                `}
            </style>

            <Button disabled={disabled} onClick={onClick || (()=>{})} type={type} className={`border border-dark border-2 rounded-pill fw-bold ${className ? className : ""}`} variant="info" size="normal">
                {text}
            </Button>
        </>
    );
}

export default CustomButton;