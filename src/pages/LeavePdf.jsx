import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Paper, Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import { RemoteUrl } from '../instant';

// Define the styles for the PDF document
const pdfStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#EFEFEF',
        padding: 20,
    },
    section: {
        margin: 5,
        padding: 10,
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    header: {
        fontSize: 15,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#333333',
    },
    text: {
        margin: 2,
        fontSize: 12,
        color: '#666666',
    },
    image: {
        height: 75,
        width: 75,
        margin: 10,
    },
    footer: {
        textAlign: 'center',
        marginTop: 25,
        fontSize: 12,
        color: '#aaaaaa',
    },
    // Add other styles as needed
});
// Create the PDF document component
const LeavePdfDocument = ({ leaveData }) => (
    <Document>
        <Page size="A4" style={pdfStyles.page}>
            <View style={pdfStyles.section}>
                <Text style={pdfStyles.header}>Employee Name: {leaveData?.employee_details.FirstName} {leaveData?.employee_details.LastName}</Text>
                <Text style={pdfStyles.text}>Date Hired: {leaveData?.employee_details.DateHired}</Text>
                <Text  style={pdfStyles.text}>Date of Birth: {leaveData?.employee_details.DateOfBirth}</Text>
                <Text style={pdfStyles.text}>Nationality: {leaveData?.employee_details.Nationality}</Text>
                <Text style={pdfStyles.text}>Gender: {leaveData?.employee_details.Gender}</Text>
                <Text style={pdfStyles.text}>Marital Status: {leaveData?.employee_details.MaritalStatus}</Text>
                <Text style={pdfStyles.text}>Email: {leaveData?.employee_details.Email}</Text>
                <Text style={pdfStyles.text}>Phone: {leaveData?.employee_details.Phone}</Text>
                <Text style={pdfStyles.text}>Insurance Number: {leaveData?.employee_details.InsuranceNumber}</Text>
                <Text style={pdfStyles.text}>Passport Number: {leaveData?.employee_details.PassportNumber}</Text>
                {/* Additional employee details if necessary */}
                <Text>Leave Type: {leaveData?.LeaveType}</Text>
                <Text>Start Date: {leaveData?.StartDate}</Text>
                <Text>End Date: {leaveData?.EndDate}</Text>
                <Text>Reason: {leaveData?.Reason}</Text>
                <Text>Status: {leaveData?.Status}</Text>
                <Text>Duration: {leaveData?.duration} days</Text>
                {leaveData?.signature_details?.signature_file && (
                <Image style={pdfStyles.image} src={leaveData?.signature_details?.signature_file} />
            )}
            </View>

        </Page>
    </Document>
);

const LeavePdf = () => {
    const [leaveData, setLeaveData] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { leaveId } = useParams();
    const [loading, setLoading] =  useState(true);
    useEffect(() => {
        setLoading(true)
        const fetchLeaveDetails = async () => {
            try {
                const response = await axios.get(`${RemoteUrl}/leavepdf/${leaveId}/`);
                setLeaveData(response.data);
            } catch (error) {
                console.error('Error fetching leave details:', error);
            }
        };

        fetchLeaveDetails();
        setLoading(false)
    }, [leaveId, loading]);

    useEffect(() => {
        if (leaveData?.signature_details?.signature_file) {
            const preloadImage = new window.Image(); // Use the native Image constructor
            preloadImage.src = leaveData.signature_details.signature_file;
            preloadImage.onload = () => setImageLoaded(true);
        }
    }, [leaveData]);

    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <>{!loading && <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }} id="leave-details">
                <Typography variant="h5" gutterBottom>Leave Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1"><b>Employee Name:</b> {leaveData?.employee_details?.FirstName} {leaveData?.employee_details?.LastName}</Typography>
                        <Typography variant="body1"><b>Position ID:</b> {leaveData?.employee_details?.position}</Typography>
                        <Typography variant="body1"><b>Date Hired:</b> {leaveData?.employee_details?.DateHired}</Typography>
                        <Typography variant="body1"><b>Nationality:</b> {leaveData?.employee_details?.Nationality}</Typography>
                        <Typography variant="body1"><b>Email:</b> {leaveData?.employee_details?.Email}</Typography>
                        {/* Include other important details as needed */}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><b>Leave Type:</b> {leaveData?.LeaveType}</Typography>
                        <Typography variant="body1"><b>Duration:</b> {leaveData?.duration} days</Typography>
                        <Typography variant="body1"><b>Start Date:</b> {leaveData?.StartDate}</Typography>
                        <Typography variant="body1"><b>End Date:</b> {leaveData?.EndDate}</Typography>
                        <Typography variant="body1"><b>Reason:</b> {leaveData?.Reason}</Typography>
                        <Typography variant="body1"><b>Status:</b> {leaveData?.Status}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <img src={leaveData?.employee_details?.ProfileImage} alt="Employee" height="100" />
                            <img src={leaveData?.signature_details?.signature_file} alt="Signature" height="100" />
                            {/* Display manager's signature if available */}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            <PDFDownloadLink
                document={<LeavePdfDocument leaveData={leaveData} />}
                fileName={`leave-details-${leaveId}.pdf`}
                style={{ textDecoration: 'none' }}
            >
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : (
                        <Button variant="contained" color="primary">
                            Download PDF
                        </Button>
                    )
                }
            </PDFDownloadLink>
        </Container>}
        </>
    );
};

export default LeavePdf;