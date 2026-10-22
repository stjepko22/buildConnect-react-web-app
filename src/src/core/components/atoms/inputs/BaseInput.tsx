import React from 'react';
import { TextField, TextFieldProps, styled, alpha } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color']),
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
      transition: theme.transitions.create(['border-color']),
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: 2,
      borderColor: theme.palette.primary.main,
    },
    // Stilovi za Error stanje
    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
    },
    '&.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.dark,
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.light,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiFormHelperText-root': {
    fontWeight: 500,
    marginLeft: 4,
    marginTop: 4,
    fontSize: '0.75rem',
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

export type BaseInputProps = TextFieldProps;

const BaseInput: React.FC<BaseInputProps> = (props) => {
  return (
    <StyledTextField
      fullWidth
      variant="outlined"
      autoComplete="off"
      {...props}
    />
  );
};

export default BaseInput;
