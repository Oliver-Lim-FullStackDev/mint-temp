'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@mint/client';
import { Box, Button, Container, Typography } from '@mint/ui/components/core';
import { Text } from '@mint/ui/components';
import { paths } from 'src/routes/paths';

const REDIRECTS = {
  home: paths.casinos.root,
  spinNow: paths.casinos.details('minty-spins'),
};
interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  icon: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'GM',
    description: 'When we say GM, we mean Get Minted. Jump in, play for free, and start stacking. It all kicks off right here on Telegram.',
    startTime: 0,
    endTime: 4,
    icon: '/assets/images/onboarding/step1.png',
  },
  {
    id: 2,
    title: 'PLAY TO WIN',
    description: 'MintBucks (MBX) are your free chips. Win or lose, every spin fuels your XP. The more you play, the bigger you climb.',
    startTime: 4.01,
    endTime: 9.03,
    icon: '/assets/images/onboarding/step2.png'
  },
  {
    id: 3,
    title: 'BOOST XP',
    description: 'XP is your level-up fuel. Rack it up by playing, completing tasks, and you\'ll bag a bigger cut when $MINT drops.',
    startTime: 9.04,
    endTime: 13,
    icon: '/assets/images/onboarding/step3.png'
  },
  {
    id: 4,
    title: 'EARN',
    description: 'Invite your crew, smash daily tasks, and scoop extra rewards on the way. Hustle your way to more XP, and more perks.',
    startTime: 13.01,
    endTime: 16.05,
    icon: '/assets/images/onboarding/step4.png'
  },
  {
    id: 5,
    title: 'LFG',
    description: 'Your free spins are ready and waiting. Hit the Minty Spins reels, rack up rewards and go full degen in the casino. **It\'s go time!**',
    startTime: 16.05,
    endTime: 21.12,
    icon: '/assets/images/onboarding/step5.png',
  }
];

export function OnboardingClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showFinalButtons, setShowFinalButtons] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekingRef = useRef(false); // To avoid UI jump during manual seek
  const router = useRouter();
  // Swipe detection
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const minSwipeDistance = 50; // Minimum distance for a swipe
  useEffect(() => {
    // Simulate video preloading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVideoReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  // Seamless playback: update UI overlays based on currentTime
  useEffect(() => {
    if (!videoRef.current || !isVideoReady) return;
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (seekingRef.current) return; // Don't update UI during manual seek
      const t = video.currentTime;

      // Check if video has reached the end of current slide
      const currentStepData = onboardingSteps[currentStep];
      if (currentStepData && t >= currentStepData.endTime) {
        video.pause();
      }

      // Only update final buttons state, don't change current step automatically
      const stepIndex = onboardingSteps.findIndex(
        (step, idx) => t >= step.startTime && (idx === onboardingSteps.length - 1 || t < (onboardingSteps[idx + 1]?.startTime || 0))
      );
      if (stepIndex !== -1) {
        setShowFinalButtons(stepIndex === onboardingSteps.length - 1);
      }
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isVideoReady, currentStep]);

  // Manual navigation: seek video to step start time
  const handleDotClick = (stepIndex: number) => {
    if (!videoRef.current) return;
    seekingRef.current = true;
    setCurrentStep(stepIndex);
    setShowFinalButtons(stepIndex === onboardingSteps.length - 1);
    videoRef.current.currentTime = onboardingSteps[stepIndex]?.startTime || 0;
    videoRef.current.play().catch(() => {});
    setTimeout(() => { seekingRef.current = false; }, 300); // Allow time for seek
  };
  // Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0]?.clientX || null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0]?.clientX || null;
  };
  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentStep < onboardingSteps.length - 1) {
      // Swipe left - go to next step
      handleDotClick(currentStep + 1);
    } else if (isRightSwipe && currentStep > 0) {
      // Swipe right - go to previous step
      handleDotClick(currentStep - 1);
    }
  };

  const setOnboardingCookie = async () => {
    await apiFetch('/onboarding', { method: 'POST' });
  }

  const handleCompleteOnboarding = () => {
    setOnboardingCookie();
    router.replace(REDIRECTS.spinNow + window.location.search);
  };
  const handleSkipSpins = async () => {
    await setOnboardingCookie();
    router.replace(REDIRECTS.home + window.location.search);
  };

  if (isLoading) {
    return (
      <Container
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          padding: '0'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
            zIndex: 20
          }}
        >
          <Image
            src="/logo/logo-full.svg"
            alt="Loading..."
            width={80}
            height={80}
            style={{ filter: 'brightness(0) invert(1)' }}
            priority
          />
        </Box>
      </Container>
    );
  }

  const currentStepData = onboardingSteps[currentStep];
  if (!currentStepData) {
    return (
      <Container
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          padding: '0'
        }}
      >
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        padding: '0'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <Box
          component="video"
          ref={videoRef}
          src="/assets/videos/onboarding-video.mp4"
          muted
          playsInline
          autoPlay
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: isVideoReady ? "block" : "none"
          }}
        />
        {!isVideoReady && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <Image
              src="/assets/images/logo.svg"
              alt="Loading..."
              width={60}
              height={60}
              style={{ filter: 'brightness(0) invert(1)' }}
              priority
            />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px'
          }}
        >
          {onboardingSteps.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: index === currentStep ? '32px' : '12px',
                height: '12px',
                borderRadius: index === currentStep ? '6px' : '50%',
                backgroundColor: index === currentStep ? '#4ade80' : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s cubic-bezier(.4,1.3,.6,1)',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
        <Box sx={{ maxWidth: "500px", width: "100%", textAlign: "left", position: "relative" }}>
        <Image
            src={currentStepData.icon}
            alt={`Step ${currentStepData.id}`}
            width={currentStepData.id === 1 || currentStepData.id === 5 ? 60 : 120}
            height={60}
            style={{
              objectFit: 'contain',
              height: 'auto',
            }}
            priority
            unoptimized
          />
        {/* Title */}
        <Text variant="h2" color="text-primary" sx={{ mb: 1 }}>
        {currentStepData.title}
        </Text>
        {/* Description */}
        <Text variant="body1" color="text-primary" sx={{ mb: 4 }}>
          {currentStepData.description.split('**').map((part, index) =>
            index % 2 === 1 ? (
              <strong key={index}>{part}</strong>
            ) : (
              part
            )
          )}
        </Text>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              minHeight: "120px",
              justifyContent: "flex-end",
            }}
          >
            {isLastStep && (
            <>
              <Button
                variant="contained"
                onClick={handleCompleteOnboarding}
                fullWidth
                sx={{
                  backgroundColor: '#00F9C7',
                  height: '48px',
                  minWidth: '64px',
                  padding: '0px 16px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  textTransform: 'none',
                  marginBottom: '8px',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#00E6B3'
                  }
                }}
              >
                Play Minty Spins Now
              </Button>

              <Button
                variant="text"
                onClick={handleSkipSpins}
                sx={{
                  backgroundColor: 'transparent',
                  textTransform: 'none',
                  boxShadow: 'none',
                  marginBottom: '16px',
                  color: 'var(--primary-lighter, #A4FFF6)',
                  textAlign: 'center',
                  fontFamily: 'var(--body2-family, "Red Hat Text")',
                  fontSize: 'var(--body2-size, 14px)',
                  fontStyle: 'normal',
                  fontWeight: 'var(--body2-weight, 400)',
                  lineHeight: 'var(--body2-line-height, 22px)',
                  letterSpacing: 'var(--body2-letter-spacing, 0)',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'var(--primary-lighter, color(display-p3 0.7843 1 0.9647))'
                  }
                }}
              >
                Take me to the Casino
              </Button>

              {/* Terms & Conditions */}
              <Typography
                variant="caption"
                sx={{
                  color: 'var(--text-secondary, #949AA2)',
                  textAlign: 'center',
                  fontFamily: 'var(--caption-family, "Red Hat Text")',
                  fontSize: 'var(--caption-size, 12px)',
                  fontStyle: 'normal',
                  fontWeight: 'var(--caption-weight, 400)',
                  lineHeight: 'var(--caption-line-height, 18px)',
                  letterSpacing: 'var(--caption-letter-spacing, 0)',
                  marginBottom: '8px'
                }}
              >
                By continuing you agree to our Terms & Conditions
              </Typography>
            </>
          )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
