import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { timeZone } from "./config";

const I18nProvider = async ({
  children,
}: { children: React.ReactNode }) => {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
};

export { I18nProvider };
