'use client';

import Image from 'next/image';
import BaseModalButton from './base-modal-button';
import { ModalButtonState } from '../../utils/modal-button-types';

interface TonModalButtonProps {
  buttonState: ModalButtonState;
}

export default function TonModalButton({ buttonState }: TonModalButtonProps) {
  return (
    <BaseModalButton buttonState={buttonState}>
      <Image
        src="/assets/images/store/ton.svg"
        alt="TON"
        width={25}
        height={25}
      />
    </BaseModalButton>
  );
}
