'use client';

import { useTranslations } from 'next-intl';

import React, { createContext, PropsWithChildren, ReactNode, useContext, useState } from 'react';

type ConfirmOptions = {
  title: ReactNode;
  confirmMessage: ReactNode;
  onConfirm(): Promise<void> | void;
};
const ConfirmContext = createContext<{
  showConfirm(opts: ConfirmOptions): void;
} | null>(null);

/**
 * Any ConfirmDialog component used with ConfirmProvider should use these props
 */
export type ConfirmComponentProps = {
  open: boolean;
  message: ReactNode;
  title: ReactNode;
  onClose(): void;
  onConfirm(): Promise<void> | void;
  confirming?: boolean;
};

/**
 * Props for ConfirmProvider.
 * ConfirmComponent is a React.ComponentType with ConfirmComponentProps.
 * This is for type safety, if you pass a different component it will result in an error.
 */
export type ConfirmProviderProps = {
  ConfirmComponent: React.ComponentType<ConfirmComponentProps>;
} & PropsWithChildren;

/**
 * Confirm provider definition
 */
const ConfirmProvider = ({ ConfirmComponent, children }: ConfirmProviderProps) => {
  const t = useTranslations('components.confirmDialog');
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultOptions: ConfirmOptions = {
    title: t('confirm'),
    confirmMessage: t('confirm_message'),
    async onConfirm() {
      setShown(false);
    }
  };
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions>(defaultOptions);

  const showConfirm = (opts?: Partial<ConfirmOptions>) => {
    setShown(true);
    setConfirmOptions({
      confirmMessage: opts?.confirmMessage ?? defaultOptions.confirmMessage,
      onConfirm: opts?.onConfirm ?? defaultOptions.onConfirm,
      title: opts?.title ?? defaultOptions.title
    });
  };

  const hideConfirm = () => setShown(false);
  const onConfirm = async () => {
    setLoading(true);
    confirmOptions.onConfirm && (await confirmOptions.onConfirm());
    setLoading(false);
    setShown(false);
  };
  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      <ConfirmComponent
        open={shown}
        onClose={hideConfirm}
        onConfirm={onConfirm}
        message={confirmOptions.confirmMessage}
        title={confirmOptions.title}
        confirming={loading}
      />
      {children}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('Please Use ConfirmProvider in parent component.');
  }

  return context;
};
