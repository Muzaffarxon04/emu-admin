import { RxReload } from 'react-icons/rx';
import styles from './styles.module.scss';
import { Box, Button } from '@chakra-ui/react';

type Props = {
    onReset: () => void;
    style?: any
}

export function ErrorCard({ onReset, style }: Props) {
    return (
        <Box sx={{ ...style }} className={styles.container}>
            {!!onReset && (
                <Button
                    onClick={onReset}
                    className={styles.button}
                    leftIcon={<RxReload className={styles.icon} size={20} />}
                >
                    Попробуйте еще раз
                </Button>
            )}
        </Box>
    );
}
