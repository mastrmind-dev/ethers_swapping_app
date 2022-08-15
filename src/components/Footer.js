import React from "react";
import { Card, Button } from "react-bootstrap";

const Footer = () => {
  return (
    <Card className="text-center" style={{height: "30vh"}}>
      {/* <Card.Header>Featured</Card.Header> */}
      <Card.Body className="bg-dark text-white">
        <Card.Title>Payment Gateway</Card.Title>
        <Card.Text>
          SL Token the digital version of Sri Lankan Rupees.
        </Card.Text>
        <Button variant="warning">Payment Gateway</Button>
      </Card.Body>
      {/* <Card.Footer className="text-muted">2 days ago</Card.Footer> */}
    </Card>
  );
};

export default Footer;
