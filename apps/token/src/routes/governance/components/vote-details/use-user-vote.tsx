import { captureException, captureMessage } from '@sentry/minimal';
import * as React from 'react';

import { VoteValue } from '../../../../__generated__/globalTypes';
import { VOTE_VALUE_MAP } from './vote-types';
import { useVegaWallet } from '@vegaprotocol/wallet';

export type Vote = {
  value: VoteValue;
  datetime: string;
  party: { id: string };
};

export type Votes = Array<Vote | null>;

export enum VoteState {
  NotCast = 'NotCast',
  Yes = 'Yes',
  No = 'No',
  Pending = 'Pending',
  Failed = 'Failed',
}

export function getUserVote(pubkey: string, yesVotes?: Votes, noVotes?: Votes) {
  const yesVote = yesVotes?.find((v) => v && v.party.id === pubkey);
  const noVote = noVotes?.find((v) => v && v.party.id === pubkey);
  if (yesVote) {
    return yesVote;
  } else if (noVote) {
    return noVote;
  } else {
    return null;
  }
}

/**
 * Finds the status of a users given vote in a given proposal and provides
 * a function to send a vote transaction to your wallet
 */
export function useUserVote(
  proposalId: string | null,
  yesVotes: Votes | null,
  noVotes: Votes | null
) {
  const { keypair, sendTx } = useVegaWallet();
  const yes = React.useMemo(() => yesVotes || [], [yesVotes]);
  const no = React.useMemo(() => noVotes || [], [noVotes]);

  const [voteState, setVoteState] = React.useState<VoteState | null>(
    VoteState.NotCast
  );

  // Find the users vote everytime yes or no votes change
  const userVote = React.useMemo(() => {
    if (keypair) {
      return getUserVote(keypair.pub, yes, no);
    }
    return null;
  }, [keypair, yes, no]);

  // If user vote changes update the vote state
  React.useEffect(() => {
    if (!userVote) {
      setVoteState(VoteState.NotCast);
    } else {
      setVoteState(
        userVote.value === VoteValue.Yes ? VoteState.Yes : VoteState.No
      );
    }
  }, [userVote]);

  // Start a starts a timeout of 30s to set a failed message if
  // the vote is not seen by the time the callback is invoked
  React.useEffect(() => {
    // eslint-disable-next-line
    let timeout: any;

    if (voteState === VoteState.Pending) {
      setTimeout(() => {
        setVoteState(VoteState.Failed);
        captureMessage('Vote not seen after 30s');
      }, 1000 * 30);
    } else {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [voteState]);

  /**
   * Casts a vote using the users connected wallet
   */
  async function castVote(value: VoteValue) {
    if (!proposalId || !keypair) return;

    setVoteState(VoteState.Pending);

    try {
      const variables = {
        pubKey: keypair.pub,
        propagate: true,
        voteSubmission: {
          value: VOTE_VALUE_MAP[value],
          proposalId,
        },
      };
      await sendTx(variables);

      // Now await vote via poll in parent component
    } catch (err) {
      setVoteState(VoteState.Failed);
      captureException(err);
    }
  }

  return {
    voteState,
    castVote,
    userVote,
    voteDatetime: userVote ? new Date(userVote.datetime) : null,
  };
}
