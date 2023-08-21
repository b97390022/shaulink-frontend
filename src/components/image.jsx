import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const ImageComponent = ({ content }) => {

    return (
        <Container>
            <Row>
            {
                content.map((c, index) => {
                    return (
                        <Col key={`${index}-col`} xs={12} md={12}>
                            <Image animation={"false"} className="mx-auto d-block" src={process.env.NODE_ENV === "production" ? `/api/v1/image/${c.object_name}` :  `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/v1/image/${c.object_name}`} fluid />
                        </Col>
                    )                         
                })
            }             
            </Row>     
        </Container>    
    )
};

export default ImageComponent;