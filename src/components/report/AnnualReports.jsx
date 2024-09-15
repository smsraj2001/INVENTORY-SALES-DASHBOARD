import React, { useState } from 'react';
import { Container, Row, Col, Dropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './AnnualReports.css'; // Import the CSS file

const documents = [
  { id: 1, title: 'Tax Deduction on Dividend', year: '2023-2024', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1hVdphUJzrthNrL16EL1D8RgxHNrNSdXX/view?usp=drive_link' },
  { id: 2, title: 'Form MGT-7', year: '2023-2024', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1aIKQW0N7Zo_L7zRuqROb-cso_qNh-q1D/view?usp=drive_link' },
  { id: 3, title: 'Annual Report 2023-24', year: '2023-2024', reportType: 'Customs', url: 'https://drive.google.com/file/d/1mceVsTYI7MWsn17mJTaXr9dhKEHr8JZ2/view?usp=drive_link' },
  { id: 4, title: 'TML Subsidiary Structure', year: '2023-2024', reportType: 'Customs', url: 'https://drive.google.com/file/d/1ce_dwm4No1FRH0l0S4yI0zVkvgjSoQ9B/view?usp=drive_link' },
  { id: 5, title: 'Financial Report of Subsidiary Companies', year: '2023-2024', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1nqy1KddDV8FsUAOAx6VJPKW2v0XnBImY/view?usp=drive_link' },
  { id: 6, title: 'JLR Inventory Report 2023-24', year: '2023-2024', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1sHU7nW2-Dy6iq35UU-6wCX94M7w40n2y/view?usp=drive_link' },
  { id: 7, title: 'Inventory Control Report 2023-24', year: '2022-2023', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1i-1vxCjZ2uMPqOkRjxs9nQuw1PpWThlI/view?usp=drive_link' },

  { id: 8, title: 'Inventory Control 2022-23', year: '2022-2023', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1rgNGVtopXFWXjLOFcCRVTDp2eGDpceiI/view?usp=drive_link' },
  { id: 9, title: 'Tax Deduction Report 2022-23', year: '2022-2023', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1hVdphUJzrthNrL16EL1D8RgxHNrNSdXX/view?usp=drive_link' },
  { id: 10, title: 'Form MGT-7', year: '2022-2023', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1aIKQW0N7Zo_L7zRuqROb-cso_qNh-q1D/view?usp=drive_link' },
  { id: 11, title: 'Customs vCompliance Report 2022-23', year: '2022-2023', reportType: 'Customs', url: 'https://drive.google.com/file/d/1sHU7nW2-Dy6iq35UU-6wCX94M7w40n2y/view?usp=drive_link' },
  { id: 12, title: 'Inventory Report 2022-23', year: '2022-2023', reportType: 'Customs', url: 'https://drive.google.com/file/d/1sHU7nW2-Dy6iq35UU-6wCX94M7w40n2y/view?usp=drive_link' },

  { id: 13, title: 'Annual Report 2021-22', year: '2021-2022', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1mceVsTYI7MWsn17mJTaXr9dhKEHr8JZ2/view?usp=drive_link' },
  { id: 14, title: 'Inventory Report 2021-22', year: '2021-2022', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1sHU7nW2-Dy6iq35UU-6wCX94M7w40n2y/view?usp=drive_link' },
  { id: 15, title: 'Form MGT-7', year: '2021-2022', reportType: 'Inventory', url: 'https://www.tvsmotor.com/-/media/fce3826cb6e84b66a7e713c7ec070cbe.ashx' },
  { id: 16, title: 'Customs Report 2021-22', year: '2021-2022', reportType: 'Customs', url: 'https://www.tvsmotor.com/-/media/d579f8f308f1459286b749968b82c355.ashx' },
  { id: 17, title: 'Business Report 2021-22', year: '2021-2022', reportType: 'Customs', url: 'https://drive.google.com/file/d/1ce_dwm4No1FRH0l0S4yI0zVkvgjSoQ9B/view?usp=drive_link' },
  { id: 18, title: 'Financial Report 2021-22', year: '2021-2022', reportType: 'Financial Reports', url: 'https://www.tvsmotor.com/-/media/d579f8f308f1459286b749968b82c355.ashx' },
  { id: 19, title: 'Tax Deduction on Dividend', year: '2021-2022', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1mceVsTYI7MWsn17mJTaXr9dhKEHr8JZ2/view?usp=drive_link' },
  { id: 20, title: 'Form MGT-7', year: '2020-2021', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1mceVsTYI7MWsn17mJTaXr9dhKEHr8JZ2/view?usp=drive_link' },
  { id: 21, title: 'Financial Report 2020-21', year: '2020-2021', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1mceVsTYI7MWsn17mJTaXr9dhKEHr8JZ2/view?usp=drive_link' },
  { id: 22, title: 'TML Subsidiary Structure 2020-2021', year: '2020-2021', reportType: 'Customs', url: 'https://drive.google.com/file/d/1i-1vxCjZ2uMPqOkRjxs9nQuw1PpWThlI/view?usp=drive_link' },
  { id: 23, title: 'Customs Compliance Report 2020-21', year: '2020-2021', reportType: 'Customs', url: 'https://www.tvsmotor.com/-/media/7601d9903eea4788a70b18815f6442ec.ashx' },
  { id: 24, title: 'JLR Inventory Report 2020-21', year: '2020-2021', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1sHU7nW2-Dy6iq35UU-6wCX94M7w40n2y/view?usp=drive_link' },
  { id: 25, title: 'Inventory Control Report 2020-21', year: '2020-2021', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1sHU7nW2-Dy6iq35UU-6wCX94M7w40n2y/view?usp=drive_link' },

  { id: 26, title: 'Annual Report 2019-20', year: '2019-2020', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1mceVsTYI7MWsn17mJTaXr9dhKEHr8JZ2/view?usp=drive_link' },
  { id: 27, title: 'Tax Deduction Report 2019-20', year: '2019-2020', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1ce_dwm4No1FRH0l0S4yI0zVkvgjSoQ9B/view?usp=drive_link' },
  { id: 28, title: 'Business Responsibility Report 2019-2020', year: '2019-2020', reportType: 'Customs', url: 'https://drive.google.com/file/d/1i-1vxCjZ2uMPqOkRjxs9nQuw1PpWThlI/view?usp=drive_link' },
  { id: 29, title: 'Customs Compliance Report 2022-23', year: '2019-2020', reportType: 'Customs', url: 'https://drive.google.com/file/d/1ce_dwm4No1FRH0l0S4yI0zVkvgjSoQ9B/view?usp=drive_link' },
  { id: 30, title: 'Inventory Report 2019-20', year: '2019-2020', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1i-1vxCjZ2uMPqOkRjxs9nQuw1PpWThlI/view?usp=drive_link' },

  { id: 31, title: 'Inventory Report 2019-20', year: '2019-2020', reportType: 'Inventory', url: 'https://drive.google.com/file/d/1i-1vxCjZ2uMPqOkRjxs9nQuw1PpWThlI/view?usp=drive_link' },
  { id: 32, title: 'Annual Report 2018-19', year: '2018-2019', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1i-1vxCjZ2uMPqOkRjxs9nQuw1PpWThlI/view?usp=drive_link' },
  { id: 33, title: 'Form MGT-7', year: '2018-2019', reportType: 'Financial Reports', url: 'https://drive.google.com/file/d/1i-1vxCjZ2uMPqOkRjxs9nQuw1PpWThlI/view?usp=drive_link' },
  { id: 34, title: 'Customs Compliance Report 2018-19', year: '2018-2019', reportType: 'Customs', url: 'https://drive.google.com/file/d/1ce_dwm4No1FRH0l0S4yI0zVkvgjSoQ9B/view?usp=drive_link' },
  { id: 35, title: 'Business Responsibility Report 2018-2019', year: '2018-2019', reportType: 'Customs', url: 'https://www.tvsmotor.com/-/media/d579f8f308f1459286b749968b82c355.ashx' },
  { id: 36, title: 'JLR Inventory Report 2018-19', year: '2018-2019', reportType: 'Inventory', url: 'https://www.tvsmotor.com/-/media/d579f8f308f1459286b749968b82c355.ashx' },
  { id: 36, title: 'Inventory Control Report 20218-19', year: '2018-2019', reportType: 'Inventory', url: 'https://www.tvsmotor.com/-/media/d579f8f308f1459286b749968b82c355.ashx' },

];

// Function to generate a list of years from 2002-2003 to 2023-2024
const generateYears = () => {
  const years = [];
  for (let year = 2018; year <= 2023; year++) {
    const nextYear = year + 1;
    years.push(`${year}-${nextYear}`);
  }
  return years.reverse(); // Show the latest years first
};

const AnnualReports = () => {
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  const [selectedReport, setSelectedReport] = useState('Financial Reports');

  const years = generateYears();

  return (
    <Container className="my-5">
      <Row className="g-2 justify-content-center">
        {/* Financial Year Dropdown */}
        <Col md={6} className="text-center">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="financial-year-dropdown">
              Filter by financial year: {selectedYear}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {years.map(year => (
                <Dropdown.Item key={year} onClick={() => setSelectedYear(year)}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {/* Reports Dropdown */}
        <Col md={6} className="text-center">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="reports-dropdown">
              Filter by report type: {selectedReport}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedReport('Financial Reports')}>Financial Reports</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedReport('Customs')}>Customs</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedReport('Inventory')}>Inventory</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Document List */}
      <Row className="mt-4">
        {documents
          .filter(doc => doc.year === selectedYear && doc.reportType === selectedReport)
          .slice(0, 4) // Ensure at least 4 reports are shown
          .map(doc => (
            <Col md={12} key={doc.id} className="d-flex justify-content-between align-items-center border-bottom py-2 report-item">
              <span>{doc.title}</span>
              <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                <Button variant="link">
                  <FontAwesomeIcon icon={faDownload} />
                </Button>
              </a>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default AnnualReports;
