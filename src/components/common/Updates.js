import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import styled from "styled-components"; // Import styled-components
const apiUrl = process.env.REACT_APP_API_URL;

const Container = styled.div`
  margin-top: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const HeaderCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 70px;
  background-color: #f3eeec;
  margin-bottom: 40px;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const CardWrapper = styled.div`
  flex: 1 1 calc(50% - 20px);
  box-sizing: border-box;
  margin-bottom: 20px;

  @media (max-width: 767px) {
    flex: 1 1 100%;
  }
`;

const Card = styled.div`
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Updated shadow for more depth */
  border-radius: 15px; /* Add rounded borders */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensure content doesn't overflow the card's rounded corners */
  background-color: white; /* Background for better contrast */
  min-height: 300px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Shadow effect on hover */
  }
`;

const CardImage = styled.img`
  height: 250px;
  object-fit: cover;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const CardBody = styled.div`
  padding: 15px;
`;

const CardTitle = styled.h5`
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardText = styled.p`
  font-size: 14px;
`;

const Updates = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch news data from the localhost API
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${apiUrl}/updates`);
        setNews(response.data); // Set the news state with the fetched data
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <Container>
      {/* Header */}
      <HeaderCard>
        <h1 className="card-title text-danger">DAILY UPDATES</h1>
      </HeaderCard>

      {/* News Cards */}
      <CardGrid>
        {news.length > 0 ? (
          news.map((item) => (
            <CardWrapper key={item.id}>
              <Card>
                <CardImage src={item.imageUrl} alt={item.title} />
                <CardBody>
                  <CardTitle>{item.title}</CardTitle>
                  <CardText>{item.description}</CardText>
                </CardBody>
              </Card>
            </CardWrapper>
          ))
        ) : (
          <div>No updates available.</div>
        )}
      </CardGrid>
    </Container>
  );
};

export default Updates;
