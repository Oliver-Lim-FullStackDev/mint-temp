import { User } from './auth.types';

export const AuthMapper = {
  fromApi(user): User {
    return {
      id: user?.id,
      wallet: user?.wallet,
      username: user?.username,
      token: user?.token,
      player: {
        account: user?.player?.account,
        balances: user.player?.balances,
        email: user?.player?.email,
        internalId: user?.player?.internalId,
        mapsPlayerId: user?.player?.mapsPlayerId,
        referralCount: user?.player?.referralCount,
        referralId: user?.player?.referralId,
        username: user?.player?.username,
        profileImageUrl: user?.player?.profileImageUrl,
      },
    };
  },
};
