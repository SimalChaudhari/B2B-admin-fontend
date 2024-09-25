import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Divider,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Stack,
} from '@mui/material';

// View Page Dialog for displaying user details
export function UserViewDialog({ open, onClose, userView }) {
    if (!userView) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    User Details
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    X
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* User Profile Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
                    <Avatar
                        alt={userView.firstName}
                        src={userView.profileUrl || '/path-to-placeholder-image'}
                        sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mr: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 0 } }}
                    />
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {`${userView.firstName} ${userView.lastName}`}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {userView.email}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* User Information Section */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Contact Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                Mobile Number:
                            </Typography>
                            <Typography variant="body1">{userView.mobile || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                Country:
                            </Typography>
                            <Typography variant="body1">{userView.country || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Address Information Section */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Address Information
                </Typography>

                <Grid container spacing={2}>

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                Street/Address:
                            </Typography>
                            <Typography variant="body1">
                                {userView?.addresses[0]?.address || 'Not provided'}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                State/Province:
                            </Typography>
                            <Typography variant="body1">
                                {userView?.addresses[0]?.state || 'Not provided'}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                City:
                            </Typography>
                            <Typography variant="body1">
                                {userView?.addresses[0]?.city || 'Not provided'}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                Zip Code:
                            </Typography>
                            <Typography variant="body1">
                                {userView?.addresses[0]?.zipCode || 'Not provided'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} /> {/* Divider after Address Information */}

                {/* Status */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Status:
                    </Typography>
                    <Typography variant="body1">{userView.status}</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
