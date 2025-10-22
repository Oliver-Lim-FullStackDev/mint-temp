'use client';

import { Text } from '@mint/ui/components';
import { Box, Stack } from '@mint/ui/components/core';
import React, { useState } from 'react';
import { TabSelector, type TabOption } from '../';
import { AccountSection, type AccountSectionProps } from './account-section';

export interface SectionData extends Omit<AccountSectionProps, 'children'> {
  id: string;
  content: React.ReactNode;
}

export interface TabData {
  id: string;
  label: string;
  sections: SectionData[];
}

export interface AccountInfoAreaProps {
  title: string;
  tabs: TabData[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  sx?: any;
}

export const AccountInfoArea: React.FC<AccountInfoAreaProps> = ({
  title,
  tabs,
  defaultActiveTab,
  onTabChange,
  sx,
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabOptions: TabOption[] = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
  }));

  const currentTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <Box sx={sx}>
      {/* Header with Title and Tab Selector */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Text
          variant="h2"
          fontFamily='Mattone'
        >
          {title}
        </Text>

        <TabSelector
          tabs={tabOptions}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </Stack>

      {/* Sections List */}
      <Box>
        {currentTabData?.sections.map((section) => (
          <AccountSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            sx={section.sx}
          >
            {section.content}
          </AccountSection>
        ))}
      </Box>
    </Box>
  );
};