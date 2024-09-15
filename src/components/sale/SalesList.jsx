import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, CircularProgress, Paper } from '@mui/material';
const apiUrl = process.env.REACT_APP_API_URL;

const SalesList = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get(`${apiUrl}/sales`);
                setSales(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sales data:', error);
                setError('Error fetching sales data');
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const employeeId = currentUser ? String(currentUser.id) : null; 


    const filteredSales = sales.filter(sale => {
        const saleEmpId = String(sale.empid);
        console.log(`Filtering sale with ID: ${sale.id}, Sale Employee ID: ${saleEmpId}, Current Employee ID: ${employeeId}`);
        if (saleEmpId !== employeeId) return false;
        if (filter === 'All') return true;
        return sale.status === filter;
    });

    console.log('Filtered Sales:', filteredSales);
    if (loading) return <CircularProgress />;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    return (
        <Box className="container mt-5" sx={{ padding: 2 }}>
            <Typography variant="h4" className="text-center text-white bg-dark p-3 rounded mb-4" sx={{ fontWeight: 'bold', color: '#333' }}>
                Sales List
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mt={4}>
                {filteredSales.length > 0 ? (
                    filteredSales.map(sale => (
                        <Card 
                            key={sale.id} 
                            sx={{ 
                                width: 300, 
                                mb: 2, 
                                p: 2, 
                                border: '1px solid #ddd', 
                                borderRadius: 2, 
                                boxShadow: 3,
                                transition: '0.3s',
                                '&:hover': {
                                    boxShadow: 6,
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {sale.customer_company_name} (ID: {sale.id})
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Status: <span style={{ color: getStatusColor(sale.status) }}>{sale.status}</span>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Quantity: {sale.order_quantity}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Date: {new Date(sale.date_of_purchase).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No sales found for this status.</Typography>
                )}
            </Box>
        </Box>
    );
};

// Function to determine status color
const getStatusColor = (status) => {
    switch (status) {
        case 'Approved':
            return 'green'; 
        case 'Rejected':
            return 'red'; 
        case 'Pending':
            return 'orange'; 
        default:
            return 'black'; 
    }
};

export default SalesList;
