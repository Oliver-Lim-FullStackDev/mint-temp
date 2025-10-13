'use client';

import BaseModalButton from './base-modal-button';
import { ModalButtonState } from '../../utils/modal-button-types';

interface OneTimeModalButtonProps {
  buttonState: ModalButtonState;
}

export default function OneTimeModalButton({ buttonState }: OneTimeModalButtonProps) {
  return <BaseModalButton buttonState={buttonState} />;
}
