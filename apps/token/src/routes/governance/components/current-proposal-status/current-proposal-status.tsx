import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ProposalState } from '../../../../__generated__/globalTypes';
import { useVoteInformation } from '../../hooks';
import type { Proposals_proposals } from '../../proposals/__generated__/Proposals';

const StatusPass = ({ children }: { children: React.ReactNode }) => (
  <span className="text-vega-green">{children}</span>
);

const StatusFail = ({ children }: { children: React.ReactNode }) => (
  <span className="text-intent-danger">{children}</span>
);

export const CurrentProposalStatus = ({
  proposal,
}: {
  proposal: Proposals_proposals;
}) => {
  const { willPass, majorityMet, participationMet } = useVoteInformation({
    proposal,
  });
  const { t } = useTranslation();

  const daysClosedAgo = formatDistanceToNow(
    new Date(proposal.terms.closingDatetime),
    { addSuffix: true }
  );

  const daysEnactedAgo = formatDistanceToNow(
    new Date(proposal.terms.enactmentDatetime),
    { addSuffix: true }
  );

  if (proposal.state === ProposalState.Open && willPass) {
    return <StatusPass>{t('shouldPass')}</StatusPass>;
  }

  if (!participationMet) {
    return (
      <>
        <span>{t('voteFailedReason')}</span>
        <span className="current-proposal-status__fail">
          {t('participationNotMet')}
        </span>
        <span>&nbsp;{daysClosedAgo}.</span>
      </>
    );
  }

  if (!majorityMet) {
    return (
      <>
        <span>{t('voteFailedReason')}</span>
        <StatusFail>{t('majorityNotMet')}</StatusFail>
        <span>&nbsp;{daysClosedAgo}.</span>
      </>
    );
  }

  if (
    proposal.state === ProposalState.Failed ||
    proposal.state === ProposalState.Declined ||
    proposal.state === ProposalState.Rejected
  ) {
    return (
      <>
        <span>{t('voteFailedReason')}</span>
        <StatusFail>{proposal.state}</StatusFail>
        <span>&nbsp;{daysClosedAgo}.</span>
      </>
    );
  }
  if (
    proposal.state === ProposalState.Enacted ||
    proposal.state === ProposalState.Passed
  ) {
    return (
      <>
        <span>{t('votePassed')}</span>
        <StatusPass>&nbsp;{proposal.state}</StatusPass>
        <span>
          &nbsp;
          {proposal.state === ProposalState.Enacted
            ? daysEnactedAgo
            : daysClosedAgo}
          .
        </span>
      </>
    );
  }

  if (proposal.state === ProposalState.WaitingForNodeVote) {
    return (
      <span>{t('subjectToFurtherActions', { daysAgo: daysClosedAgo })}</span>
    );
  }

  return null;
};
