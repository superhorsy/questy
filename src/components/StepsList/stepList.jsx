import React from 'react';
import {Box, Stepper, Step,StepLabel} from '@mui/material';

const steps = [
  'Создайте описание квеста',
  'Выберите тему квеста',
  'Добавьте вопросы',
  'Укажите email друга для отправки квеста',
];

export const StepsList = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper  alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}