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

import { USER_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { MenuItem, Typography } from '@mui/material';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { editUser } from 'src/store/action/userActions';
import { useFetchUserData } from '../components';

// ----------------------------------------------------------------------

export const UserEditSchema = zod.object({
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
    pinCode: zod.string().min(1, { message: 'Pin Code is required!' }), // Use pinCode instead of zipCode
    status: zod.string().min(1, { message: 'Status is required!' }),
    profile: zod.instanceof(File).optional().nullable(), // Optional profile picture
});

// ----------------------------------------------------------------------

export function UserEditForm({ open, onClose, userData }) {
    const dispatch = useDispatch(); // Initialize dispatch
    const { fetchData } = useFetchUserData(); // Destructure fetchData from the custom hook

    const defaultValues = useMemo(
        () => ({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            email: userData?.email || '',
            mobile: userData?.mobile || '',
            // Extracting address from addresses array if exists
            address: userData?.addresses?.[0]?.address || '',
            city: userData?.addresses?.[0]?.city || '',
            state: userData?.addresses?.[0]?.state || '',
            pinCode: userData?.addresses?.[0]?.pinCode || '',
            country: userData?.country || '',
            status: userData?.status || USER_STATUS_OPTIONS[0]?.value, // Default to the first status option
            profile: null, // Initialize profile picture
        }),
        [userData]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(UserEditSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        const updatedData = {
            ...data,
            addresses: [
                {
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    pinCode: data.pinCode,
                    _id: userData?.addresses?.[0]?._id || null, // Ensure you pass the address _id for updating
                },
            ],
            profile: data.profile || userData.profile, // Use existing profile if not updated
        };
        // Call the editUser action with user ID and updated data
        const isSuccess = await dispatch(editUser(userData._id, updatedData));
        if (isSuccess) {
            reset(); // Reset the form on successful update
            onClose(); // Close the dialog
            fetchData()
        }
    })

    return (
        <Dialog
            fullWidth
            maxWidth={false}
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { maxWidth: 720 } }}
        >
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Edit User</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to edit the user.
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

                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                    >
                        <Field.Text name="firstName" label="FirstName" />
                        <Field.Text name="lastName" label="LastName" />
                        <Field.Text name="email" label="Email" />
                        <Field.Phone name="mobile" label="Mobile" />
                        <Field.Text name="address" label="Address" />
                        <Field.Text name="state" label="State" />
                        <Field.Text name="city" label="City" />
                        <Field.Text name="pinCode" label="Pin Code" /> {/* Use pinCode instead of zipCode */}
                        <Field.Select name="status" label="Status">
                            {USER_STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                        <Field.CountrySelect
                            fullWidth
                            name="country"
                            label="Country"
                            placeholder="Choose a country"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Update User
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
