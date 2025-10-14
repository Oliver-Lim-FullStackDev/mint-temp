'use client';

import Image from 'next/image';
import BaseModalButton from './base-modal-button';
import { ModalButtonState } from '../../utils/modal-button-types';

interface StarsModalButtonProps {
  buttonState: ModalButtonState;
}

export default function StarsModalButton({ buttonState }: StarsModalButtonProps) {
  return (
    <BaseModalButton buttonState={buttonState}>
      <Image
        src="/assets/images/store/star.svg"
        alt="Star"
        width={25}
        height={25}
      />
    </BaseModalButton>
  );
}
