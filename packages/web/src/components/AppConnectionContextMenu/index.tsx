import * as React from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import type { PopoverProps } from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import type { IConnection } from 'types';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import Can from 'components/Can';

type Action = {
  type: 'test' | 'reconnect' | 'delete' | 'viewFlows';
};

type ContextMenuProps = {
  appKey: string;
  connection: IConnection;
  onClose: () => void;
  onMenuItemClick: (event: React.MouseEvent, action: Action) => void;
  anchorEl: PopoverProps['anchorEl'];
  disableReconnection: boolean;
};

export default function ContextMenu(
  props: ContextMenuProps
): React.ReactElement {
  const {
    appKey,
    connection,
    onClose,
    onMenuItemClick,
    anchorEl,
    disableReconnection,
  } = props;
  const formatMessage = useFormatMessage();

  const createActionHandler = React.useCallback(
    (action: Action) => {
      return function clickHandler(event: React.MouseEvent) {
        onMenuItemClick(event, action);

        onClose();
      };
    },
    [onMenuItemClick, onClose]
  );

  return (
    <Menu
      open={true}
      onClose={onClose}
      hideBackdrop={false}
      anchorEl={anchorEl}
    >
      <Can I="read" a="Flow" passThrough>
        {(allowed) => (
          <MenuItem
            component={Link}
            to={URLS.APP_FLOWS_FOR_CONNECTION(appKey, connection.id)}
            onClick={createActionHandler({ type: 'viewFlows' })}
            disabled={!allowed}
          >
            {formatMessage('connection.viewFlows')}
          </MenuItem>
        )}
      </Can>

      <Can I="update" a="Connection" passThrough>
        {(allowed) => (
          <MenuItem
            onClick={createActionHandler({ type: 'test' })}
            disabled={!allowed}
          >
            {formatMessage('connection.testConnection')}
          </MenuItem>
        )}
      </Can>

      <Can I="create" a="Connection" passThrough>
        {(allowed) => (
          <MenuItem
            component={Link}
            disabled={!allowed || disableReconnection}
            to={URLS.APP_RECONNECT_CONNECTION(
              appKey,
              connection.id,
              connection.appAuthClientId
            )}
            onClick={createActionHandler({ type: 'reconnect' })}
          >
            {formatMessage('connection.reconnect')}
          </MenuItem>
        )}
      </Can>

      <Can I="delete" a="Connection" passThrough>
        {(allowed) => (
          <MenuItem
            onClick={createActionHandler({ type: 'delete' })}
            disabled={!allowed}
          >
            {formatMessage('connection.delete')}
          </MenuItem>
        )}
      </Can>
    </Menu>
  );
}
