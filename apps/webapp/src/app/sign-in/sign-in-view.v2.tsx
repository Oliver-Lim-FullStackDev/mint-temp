'use client';

import { useBoolean } from 'minimal-shared/hooks';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, Box, IconButton, InputAdornment, Link, LoadingButton } from '@mint/ui/components/core';
import { RouterLink } from '@mint/ui/minimals/routes/components';
import { useRouter } from '@mint/ui/minimals/routes/hooks';
import { paths } from '@mint/ui/minimals/routes/paths';

import { Field, Form } from '@mint/ui/components/hook-form';
import { Iconify } from '@mint/ui/components/iconify';

import { FormHead } from '@mint/ui/minimals/auth/components/form-head';
import { useAuthContext } from '@mint/ui/minimals/auth/hooks';
import { getErrorMessage } from '@mint/ui/minimals/auth/utils';

// ----------------------------------------------------------------------

export type SignInSchemaType = typeof SignInSchema;

export const SignInSchema = { email: '', password: '' };

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get the returnTo parameter from the URL if it exists
  const [returnTo, setReturnTo] = useState<string | null>(null);

  // Extract returnTo from URL on component mount
  useEffect(() => {
    // Get the returnTo parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const returnToParam = params.get('returnTo');
    if (returnToParam) {
      setReturnTo(returnToParam);
    }
  }, []);

  const defaultValues: SignInSchemaType = {
    email: 'demo@mint.io',
    password: '@Mint',
  };

  const methods = useForm<SignInSchemaType>({
    // resolver: () => SignInSchema,
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await signInWithPassword({ email: data.email, password: data.password });
      // await checkUserSession?.();

      // Redirect to the original URL if available, otherwise refresh the page
      // if (returnTo) {
      //   router.push(returnTo);
      // } else {
      //   router.refresh();
      // }
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text name="email" label="Email address" slotProps={{ inputLabel: { shrink: true } }} />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>

        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* <TonAuthInfo /> */}
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Sign in to your account"
        description={
          <>
            {`Don’t have an account? `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              Get started
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        Use <strong>{defaultValues.email}</strong>
        {' with password '}
        <strong>{defaultValues.password}</strong>
      </Alert>

      {/*{!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}*/}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
