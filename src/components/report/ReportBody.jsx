import React, { useRef } from 'react';
import './ReportBody.css';
import { Container, Row, Col } from 'react-bootstrap';

const ReportBody = () => {
  const reportSectionRef = useRef(null);

  const scrollToReports = () => {
    reportSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className="body-page">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-60"> {/* Reduced height */}
            <Col md={8} className="text-center main-content">
              <h3 className="text-light">Investors</h3>
              <h1 className="text-light">Annual Reports</h1>
              <p className="text-light subtitle">
                Explore our financial documents and annual reports
              </p>
              <button className="btn btn-primary mt-4" onClick={scrollToReports}>
                Download Reports
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Scroll target section */}
      <div ref={reportSectionRef} className="scroll-target-section">
        {/* This section is now empty */}
      </div>
    </div>
  );
};

export default ReportBody;
