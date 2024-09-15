import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import FirstChart from '../chart/FirstChart';
import LowStockChart from '../chart/LowStockChart';
import PriceComparisonChart from '../chart/PriceComparisonChart';
import VehicleSalesChart from '../chart/VehicleSalesChart';
import VehicleSalesShareChart from '../chart/VehicleSalesShareChart';
import TopSalesEmployee from '../chart/TopSalesEmployee';

const ChartsContainer = styled.div`
  padding: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
`;

const ChartWrapper = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 300px; /* Fixed height */
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden; /* Prevent overflow outside the wrapper */
  transform: ${(props) => props.zoom ? 'scale(0.9)' : 'scale(1)'}; /* Apply zoom effect */
  transition: transform 0.3s ease-in-out; /* Smooth transition for zoom effect */
`;

const ChartContainer = styled.div`
  width: 100%;
  height: calc(100% - 40px); /* Adjust height to fit footer */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto; /* Enable scroll if content overflows */
`;

const ChartFooter = styled.div`
  font-size: 0.9rem;
  text-align: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  height: 40px; /* Fixed height for the footer */
  overflow: hidden; /* No scrollbars here */
`;

const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
`;

const ModalChart = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

Modal.setAppElement('#root'); // Set the root element for accessibility

const Charts = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState(null);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Scroll to the middle of the container
      chartContainerRef.current.scrollTop = chartContainerRef.current.scrollHeight / 2;
    }
  }, [currentChart]); // Run effect when currentChart changes

  const openModal = (chartComponent) => {
    setCurrentChart(chartComponent);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentChart(null);
  };

  return (
    <ChartsContainer>
      <Grid>
        <ChartWrapper onClick={() => openModal(<FirstChart />)}>
          <ChartContainer>
            <FirstChart />
          </ChartContainer>
          <ChartFooter>Sales Overview by Category</ChartFooter>
        </ChartWrapper>
        <ChartWrapper onClick={() => openModal(<LowStockChart />)}>
          <ChartContainer>
            <LowStockChart />
          </ChartContainer>
          <ChartFooter>Top 5 Critical Low Stock Vehicles</ChartFooter>
        </ChartWrapper>
        <ChartWrapper onClick={() => openModal(<PriceComparisonChart />)}>
          <ChartContainer>
            <PriceComparisonChart />
          </ChartContainer>
          <ChartFooter>Selling Price vs Cost Price of Each Vehicle</ChartFooter>
        </ChartWrapper>
        <ChartWrapper onClick={() => openModal(<VehicleSalesChart />)} zoom>
          <ChartContainer>
            <VehicleSalesChart />
          </ChartContainer>
          <ChartFooter>Total Sales by Vehicle Over Time</ChartFooter>
        </ChartWrapper>
        <ChartWrapper onClick={() => openModal(<VehicleSalesShareChart />)} zoom>
          <ChartContainer>
            <VehicleSalesShareChart />
          </ChartContainer>
          <ChartFooter>Sales Share</ChartFooter>
        </ChartWrapper>
        <ChartWrapper onClick={() => openModal(<TopSalesEmployee />)}>
          <ChartContainer>
            <TopSalesEmployee />
          </ChartContainer>
          <ChartFooter>Employee vs. Total Sales</ChartFooter>
        </ChartWrapper>
      </Grid>
      
      {/* Modal for displaying full-size chart */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Chart Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: '10%',
            left: '10%',
            right: '10%',
            bottom: '10%',
            margin: '0',
            padding: '0',
            border: 'none',
            borderRadius: '10px',
            width: '80vw',
            height: '80vh',
            maxWidth: '1200px',  
            maxHeight: '900px', 
          },
        }}
      >
        <ModalContent>
          <ModalChart ref={chartContainerRef}>
            {currentChart}
          </ModalChart>
        </ModalContent>
      </Modal>
    </ChartsContainer>
  );
};

export default Charts;
