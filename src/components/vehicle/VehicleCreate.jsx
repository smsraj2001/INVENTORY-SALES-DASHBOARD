import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Styled-components
const Container = styled.div`
  width: 100%;
  max-width: 1200px; /* Increased width for a larger card */
  margin: 0 auto;
`;

const Card = styled.div`
  margin-top: 20px;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
`;

const CardHeader = styled.div`
  background-color: #343a40; /* Dark background */
  color: #fff; /* White text */
  padding: 10px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  text-align: center;
  font-size: 24px; /* Larger font size */
  padding-left: 375px;
`;

const CardBody = styled.div`
  padding: 20px;
  background-color: lightgrey;
`;

const CardFooter = styled.div`
  background-color: #343a40; /* Light gray background */
  color: #6c757d; /* Muted text color */
  padding: 10px;
  border-radius: 0 0 10px 10px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #28a745; /* Green background */
  color: #fff; /* White text */
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #218838; /* Darker green on hover */
  }
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VehicleCreate = () => {
  const [name, setName] = useState('');
  const [engine, setEngine] = useState('');
  const [power, setPower] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState(''); // New state for cost price
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [category, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [topSpeed, setTopSpeed] = useState('');
  const [range, setRange] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [type, setType] = useState('2W'); // Default to "2W"
  const [newId, setNewId] = useState(null); // State to hold the new ID
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/vehicles")
      .then((response) => {
        const data = response.data;

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((vehicle) => vehicle.category)),
        ];
        setCategories(uniqueCategories);

        // Generate new ID
        const maxId = Math.max(...data.map(vehicle => vehicle.id)) || 0;
        setNewId(maxId + 1); // Set the new ID by incrementing the max ID
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    // Automatically set the type based on the selected category
    if (category === 'Three Wheelers') {
      setType('3W');
    } else if (category === 'Electric') {
      setType('2W Electric');
    } else {
      setType('2W');
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const vehicleData = {
      id: newId.toString(),
      name,
      engine,
      power,
      weight,
      price,
      cost_price: costPrice, // Include cost price
      category,
      type,
      image,
      stock: parseInt(stock),
      ...(category === 'Electric' && { range, batteryCapacity, topSpeed }),
      ...(category === 'Three Wheelers' && { engine, power, topSpeed }),
      ...(category !== 'Electric' && category !== 'Three Wheelers' && { engine, power, weight }),
    };

    axios
      .post('http://localhost:5000/vehicles', vehicleData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(() => {
        setSnackbarMessage('Vehicle added successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => navigate('/vehicle/list'), 2000); // Redirect after a short delay
      })
      .catch((err) => {
        setSnackbarMessage('Failed to add vehicle.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        console.log(err.message);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-lg-10"> {/* Increased column width */}
          <Card>
            <CardHeader>
              <Title>{`\t\t\tCreate Vehicle`}</Title>
              <Link to="/vehicle/list">
                <Button>Back</Button>
              </Link>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                    />
                  </FormGroup>

                  {/* Engine, Power, Weight for Non-Electric Two Wheelers */}
                  {(category !== 'Electric' && category !== 'Three Wheelers') && (
                    <>
                      <FormGroup>
                        <Label>Engine</Label>
                        <Input
                          value={engine}
                          onChange={(e) => setEngine(e.target.value)}
                          type="text"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Power</Label>
                        <Input
                          value={power}
                          onChange={(e) => setPower(e.target.value)}
                          type="text"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Weight</Label>
                        <Input
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          type="text"
                        />
                      </FormGroup>
                    </>
                  )}

                  {/* Three Wheelers Specific Fields */}
                  {category === 'Three Wheelers' && (
                    <>
                      <FormGroup>
                        <Label>Engine</Label>
                        <Input
                          value={engine}
                          onChange={(e) => setEngine(e.target.value)}
                          type="text"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Power</Label>
                        <Input
                          value={power}
                          onChange={(e) => setPower(e.target.value)}
                          type="text"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Top Speed</Label>
                        <Input
                          value={topSpeed}
                          onChange={(e) => setTopSpeed(e.target.value)}
                          type="text"
                        />
                      </FormGroup>
                    </>
                  )}

                  {/* Electric Vehicle Fields */}
                  {category === 'Electric' && (
                    <>
                      <FormGroup>
                        <Label>Range</Label>
                        <Input
                          value={range}
                          onChange={(e) => setRange(e.target.value)}
                          type="text"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Battery Capacity</Label>
                        <Input
                          value={batteryCapacity}
                          onChange={(e) => setBatteryCapacity(e.target.value)}
                          type="text"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Top Speed</Label>
                        <Input
                          value={topSpeed}
                          onChange={(e) => setTopSpeed(e.target.value)}
                          type="text"
                        />
                      </FormGroup>
                    </>
                  )}

                  <FormGroup>
                    <Label>Price</Label>
                    <Input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      type="text"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Cost Price</Label> {/* New cost price field */}
                    <Input
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      type="text"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Category</Label>
                    <Select
                      id="category"
                      value={category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, i) => (
                        <option key={i} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Type (Auto-set)</Label>
                    <Input
                      value={type}
                      readOnly
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Image</Label>
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      type="text"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Stock</Label>
                    <Input
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      type="number"
                    />
                  </FormGroup>
                </div>
              </form>
            </CardBody>
            <CardFooter>
              <Button type="submit" onClick={handleSubmit}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Snackbar component */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VehicleCreate;
