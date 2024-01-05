import * as React from 'react';
import {
  SnackbarProvider as BaseSnackbarProvider,
  SnackbarProviderProps,
} from 'notistack';
import { css } from '@emotion/css';

const SnackbarProvider = (props: SnackbarProviderProps): React.ReactElement => {
  const classes = {
    zIndexOverwrite: css({
      zIndex: 2200000000,
    }),
  };

  return (
    <BaseSnackbarProvider
      {...props}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
      classes={{ containerRoot: classes.zIndexOverwrite }}
    />
  );
};

export default SnackbarProvider;
