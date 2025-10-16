import { Box, Link } from '@mint/ui/components/core';
import { Text } from '@mint/ui/components';

export const TermsPrivacySection = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 2, fontSize: '0.75rem' }}>

        <Link href="https://mint.io/docs/terms-and-conditions" color="var(--text-secondary)" target="_blank">
          <Text
            variant="body2"
            component="span"
            color="inherit"
          >Terms & Conditions</Text>
        </Link>
        <Box component="span" mx={1.5} color="text-secondary">|</Box>
        <Link href="https://mint.io/docs/privacy-policy" color="var(--text-secondary)" target="_blank">
          <Text
            variant="body2"
            component="span"
            color="inherit"
          >Privacy Policy</Text>
        </Link>
    </Box>
  );
};
