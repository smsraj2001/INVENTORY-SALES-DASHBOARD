import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import './SalesCalendar.css';
const apiUrl = process.env.REACT_APP_API_URL;

const localizer = momentLocalizer(moment);

const SalesCalendar = () => {
    const [sales, setSales] = useState([]);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch sales data
        axios.get(`${apiUrl}/sales`)
            .then(response => {
                setSales(response.data);
                // Process sales data to fit calendar events
                const calendarEvents = response.data.map(sale => ({
                    id: sale.id,
                    title: `${sale.vehicle_id}, ${sale.order_quantity}, ${sale.status}`,
                    start: new Date(sale.date_of_purchase),
                    end: new Date(sale.date_of_purchase),
                    status: sale.status
                }));
                setEvents(calendarEvents);
            })
            .catch(error => {
                console.error('Error fetching sales data:', error);
            });
    }, []);

    // Get dots for a specific date
    const getDotsForDate = (date) => {
        const tasksForDate = sales.filter(sale =>
            moment(sale.date_of_purchase).isSame(moment(date), 'day')
        );

        return (
            <Box display="flex" justifyContent="center">
                {tasksForDate.map(sale => {
                    let color;
                    switch (sale.status) {
                        case 'Approved':
                            color = 'green';
                            break;
                        case 'Rejected':
                            color = 'red';
                            break;
                        default:
                            color = 'yellow';
                    }
                    return (
                        <Box
                            key={sale.id}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                margin: '0 2px',
                                display: 'inline-block',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/salesapproval/${sale.id}`)} // Navigate on click
                        />
                    );
                })}
            </Box>
        );
    };

    return (
        <Box className="calendar-container">
            <Typography variant="h4" align="center" gutterBottom>
                Sales Calendar
            </Typography>
            <Paper className="calendar-paper">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month']}
                    style={{ height: 600 }}
                    dayPropGetter={(date) => ({
                        className: 'calendar-day',
                        style: {
                            position: 'relative',
                            textAlign: 'center'
                        }
                    })}
                    dateCellWrapper={({ children, value }) => (
                        <div className="calendar-date-cell">
                            {children}
                            {getDotsForDate(value)}
                        </div>
                    )}
                />
            </Paper>
        </Box>
    );
};

export default SalesCalendar;
