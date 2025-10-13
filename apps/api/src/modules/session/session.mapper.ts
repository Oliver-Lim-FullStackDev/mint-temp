import { HG_SessionResponse, SessionResponse } from '../../shared/hero-gaming.types';

export const SessionMapper = {
  fromApi(session: HG_SessionResponse): SessionResponse | null {

    if (!session.player) {
      return null;
    }

    // @ts-expect-error
    return {
      player: {
        id: session?.player?.internalId,
        account: session.player.account,
        profileImageUrl: session?.player?.avatarImageUrl,
        // make the array an object so we have player.balances.MBX
        balances: Object.fromEntries(
          (session.player?.all_accounts ?? []).map(
            (account) => [account.currency, account]
          )
        ),
        email: session?.player?.email,
        internalId: session?.player?.internalId,
        mapsPlayerId: session?.player?.mapsPlayerId,
        referralCount: session?.player?.referral_count,
        referralId: session?.player?.referral_id,
        username: session?.player?.username,
      },
      token: session?.token,
    };
  },
};
