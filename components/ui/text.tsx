import * as Slot from '@rn-primitives/slot';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '~/lib/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
    className,
    asChild = false,
    variant,
    ...props
}: React.ComponentProps<typeof RNText> & {
    ref?: React.RefObject<RNText>;
    asChild?: boolean;
    variant?: 'default' | 'destructive' | 'muted';
}) {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    
    const getVariantClasses = () => {
        switch (variant) {
            case 'destructive':
                return 'text-base text-destructive web:select-text';
            case 'muted':
                return 'text-base text-muted-foreground web:select-text';
            default:
                return 'text-base text-foreground web:select-text';
        }
    };
    
    return (
        <Component
            className={cn(
                getVariantClasses(),
                textClass,
                className
            )}
            {...props}
        />
    );
}

export { Text, TextClassContext };
