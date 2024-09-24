import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { MenuItem, Typography } from '@mui/material';
import { USER_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { toast } from 'src/components/snackbar'; // Your toast notification component
import { Form, Field, schemaHelper } from 'src/components/hook-form'; // Custom components for form handling
import { createUser } from 'src/store/action/userActions'; // Import the action to create a user
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

// Validation schema for user creation using Zod
export const UserCreateSchema = zod.object({
    firstName: zod.string().min(1, { message: 'First Name is required!' }),
    lastName: zod.string().min(1, { message: 'Last Name is required!' }),
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
    mobile: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    address: zod.string().min(1, { message: 'Address is required!' }),
    country: zod.string().min(1, { message: 'Country is required!' }),
    state: zod.string().min(1, { message: 'State is required!' }),
    city: zod.string().min(1, { message: 'City is required!' }),
    zipCode: zod.string().min(1, { message: 'Zip Code is required!' }),
    status: zod.string().min(1, { message: 'Status is required!' }),
    profile: zod.instanceof(File).optional().nullable(), // Optional profile picture
});

// ----------------------------------------------------------------------

// User Create Form Component
export function UserCreateForm({ open, onClose }) {
    const dispatch = useDispatch();

    // Default form values
    const defaultValues = useMemo(() => ({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        status: USER_STATUS_OPTIONS[0]?.value, // Default to the first status option
        profile: null, // Initialize profile picture
    }), []);

    const methods = useForm({
        resolver: zodResolver(UserCreateSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;

    // Handle form submission
    const onSubmit = async (data) => {
        console.log('Submitting Data:', data); // Log data being submitted

        // Format the address to match your backend's expected structure
        const formattedData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobile: data.mobile,
            country: data.country,
            status: data.status,
            profile: data.profile, // Make sure to handle the file upload in your action
            addresses: [
                {
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    pinCode: data.zipCode, // Make sure to match the expected field name
                },
            ],
        };

        try {
            const response = await dispatch(createUser(formattedData));
            console.log('Dispatch Response:', response); // Log the entire response

            // Check if user object is present in response
            if (response && response.user) {
                const { user } = response; // Destructure the user object from the response
                toast.success(`User ${user.firstName} ${user.lastName} created successfully!`);

                reset(); // Reset the form fields after submission
                onClose(); // Close the dialog after submission
            } else {
                toast.error('User creation failed!');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('User creation failed!');
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Create New User</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to create a new user.
                    </Alert>
                    <Box
                    sx={{
                        mb: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Field.UploadAvatar name="profile" maxSize={3145728} />
                    <Typography variant="caption" sx={{ mt: 3, mx: 'auto', textAlign: 'center', color: 'text.disabled' }}>
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                    </Typography>
                </Box>

                    <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={3}>
                        <Field.Text name="firstName" label="First Name" />
                        <Field.Text name="lastName" label="Last Name" />
                        <Field.Text name="email" label="Email Address" />
                        <Field.Phone name="mobile" label="Mobile Number" />
                        <Field.Text name="address" label="Street Address" />
                        <Field.CountrySelect fullWidth name="country" label="Country" placeholder="Choose a country" />
                        <Field.Text name="state" label="State" />
                        <Field.Text name="city" label="City" />
                        <Field.Text name="zipCode" label="Zip Code" />
                        <Field.Select name="status" label="Status">
                            {USER_STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    </Box>
                 
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>Create User</LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
