'use client';

import BaseModalButton from './base-modal-button';
import { ModalButtonState } from '../../utils/modal-button-types';

interface DailyModalButtonProps {
  buttonState: ModalButtonState;
}

export default function DailyModalButton({ buttonState }: DailyModalButtonProps) {
  return <BaseModalButton buttonState={buttonState} />;
}
