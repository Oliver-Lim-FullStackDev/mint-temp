import { SportsbookAuthRaw, SportsbookAuth } from './sportsbook.types';

export const SportsbookMapper = {
  fromApi(raw: SportsbookAuthRaw): SportsbookAuth {
    return {
      token: raw.token,
    };
  },
};
