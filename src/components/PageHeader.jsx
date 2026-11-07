import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import Button from './Button';
import { cn } from '../utils/cn';

/**
 * Standard page header: back link (with optional actions on the right),
 * then a large serif title and an optional description.
 */
export default function PageHeader({
  title,
  description,
  onBack,
  backLabel = 'Back',
  actions,
  className,
}) {
  return (
    <header className={cn('mb-8', className)}>
      {(onBack || actions) && (
        <div className={cn('flex items-center justify-between gap-4 -mx-3', (title || description) && 'mb-6')}>
          {onBack ? (
            <Button variant="ghost" size="small" onClick={onBack} className="text-body">
              <Icon icon="basil:arrow-left-solid" className="w-6 h-6" />
              {backLabel}
            </Button>
          ) : <span />}
          {actions}
        </div>
      )}
      {title && (
        <h1 className="font-serif text-title md:text-headline text-fg text-balance">
          {title}
        </h1>
      )}
      {description && (
        <p className="font-sans text-body text-fg/70 mt-2 text-pretty">
          {description}
        </p>
      )}
    </header>
  );
}

PageHeader.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  onBack: PropTypes.func,
  backLabel: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string,
};
