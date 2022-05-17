import * as React from 'react';
import classNames from 'classnames';
import { Button, Icon } from '../';
import { IconNames } from '@blueprintjs/icons';
import type { IconName } from '../';
import { useEffect, useState } from 'react';

export const enum DRAWER_TOGGLE_VARIANTS {
  OPEN = 'open',
  CLOSE = 'close',
}

interface Props {
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
  variant: DRAWER_TOGGLE_VARIANTS.OPEN | DRAWER_TOGGLE_VARIANTS.CLOSE;
  className?: string;
}

export const DrawerToggle = ({
  onToggle,
  variant = DRAWER_TOGGLE_VARIANTS.CLOSE,
  className,
}: Props) => {
  const [iconName, setIconName] = useState(IconNames.MENU);
  const classes = classNames('md:hidden', {
    [`${className}`]: className,
  });

  useEffect(() => {
    if (variant === DRAWER_TOGGLE_VARIANTS.OPEN) {
      setIconName(IconNames.MENU);
    } else {
      setIconName(IconNames.CROSS);
    }
  }, []);

  return (
    <Button variant="inline" className={classes} onClick={onToggle}>
      <Icon name={iconName as IconName} />
    </Button>
  );
};
