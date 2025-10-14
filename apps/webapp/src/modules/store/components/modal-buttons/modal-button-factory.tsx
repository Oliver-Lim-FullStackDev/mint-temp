'use client';

import { ModalButtonState } from '../../utils/modal-button-types';
import DailyModalButton from './daily-modal-button';
import StarsModalButton from './stars-modal-button';
import TonModalButton from './ton-modal-button';

interface ModalButtonFactoryProps {
  buttonState: ModalButtonState;
}

export default function ModalButtonFactory({ buttonState }: ModalButtonFactoryProps) {
  switch (buttonState.type) {
    case 'daily':
      return <DailyModalButton buttonState={buttonState} />;

    case 'stars':
      return <StarsModalButton buttonState={buttonState} />;

    case 'ton':
      return <TonModalButton buttonState={buttonState} />;

    default:
      return null;
  }
}
