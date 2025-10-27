"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mint/ui/components/core";
import { Iconify } from "@mint/ui/components/iconify";
import { useSocialMediaMission } from "src/modules/missions/hooks/useSocialMediaMission";
import { SocialNetwork } from "src/modules/missions/config/social-media-config";

export default function SocialRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleSocialMediaMission } = useSocialMediaMission();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasHandledMission = useRef(false);

  const campaignId = searchParams.get("campaignId");
  const campaignKey = searchParams.get("campaignKey");
  const platform = searchParams.get("platform");
  const returnUrl = searchParams.get("returnUrl") || "/earn";
  const campaignData = searchParams.get("campaignData");

  useEffect(() => {
    // Prevent multiple executions using both ref and session storage
    if (hasHandledMission.current) {
      return;
    }

    // Also check session storage as a backup
    if (campaignId && sessionStorage.getItem(`social-redirect-${campaignId}`)) {
      return;
    }

    const handleRedirect = async () => {
      if (!campaignId || !platform || !campaignKey) {
        setError("Missing required parameters");
        return;
      }

      try {
        // Parse campaign data inside the effect to avoid recreation
        let campaign: any = null;
        if (campaignData) {
          try {
            campaign = JSON.parse(decodeURIComponent(campaignData));
          } catch (e) {
            console.error("Failed to parse campaign data:", e);
            setError("Invalid campaign data");
            return;
          }
        }

        setIsRedirecting(true);
        hasHandledMission.current = true;

        // Also set session storage flag
        if (campaignId) {
          sessionStorage.setItem(`social-redirect-${campaignId}`, 'true');
        }

        // Use the hook function to handle the social media mission
        await handleSocialMediaMission(
          parseInt(campaignId),
          campaignKey,
          campaign
        );

        // Redirect back to missions after a short delay
        setTimeout(() => {
          router.push(returnUrl);
        }, 2000);
      } catch (error) {
        console.error("Failed to handle social media redirect:", error);
        setError("Failed to complete mission");
        hasHandledMission.current = false; // Reset ref flag on error

        // Also reset session storage flag on error
        if (campaignId) {
          sessionStorage.removeItem(`social-redirect-${campaignId}`);
        }
      } finally {
        setIsRedirecting(false);
      }
    };

    handleRedirect();

    // Cleanup function to remove session storage flag when component unmounts
    return () => {
      if (campaignId) {
        const storageKey = `social-mission-${campaignId}`;
        const redirectKey = `social-redirect-${campaignId}`;
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(redirectKey);
      }
    };
  }, [campaignId, campaignKey, platform, returnUrl, campaignData, router, handleSocialMediaMission]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case SocialNetwork.X:
        return "socials:twitter";
      case SocialNetwork.INSTAGRAM:
        return "socials:instagram";
      case SocialNetwork.TIKTOK:
        return "socials:tiktok";
      default:
        return "socials:twitter";
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case SocialNetwork.X:
        return "X";
      case SocialNetwork.INSTAGRAM:
        return "Instagram";
      case SocialNetwork.TIKTOK:
        return "TikTok";
      default:
        return "";
    }
  };

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: 3,
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => router.push(returnUrl)}>
          Back to Missions
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 3,
        gap: 3,
      }}
    >
      {isRedirecting ? (
        <>
          <CircularProgress size={60} />
        </>
      ) : (
        <>
          <Iconify
            icon={getPlatformIcon(platform || "")}
            width={80}
            height={80}
            sx={{ color: "primary.main" }}
          />
          <Typography variant="body2" align="center" color="text.secondary">
            Completed! Redirecting back...
          </Typography>
        </>
      )}
    </Box>
  );
}
