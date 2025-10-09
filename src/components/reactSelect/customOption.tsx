import styles from './styles.module.scss';

interface CustomOptionProps {
  children: React.ReactNode;
  innerProps: any;
  innerRef: React.Ref<HTMLElement>;
}

export const CustomOption = ({
  children,
  ...props
}:CustomOptionProps) => {
  const { innerProps, innerRef } = props;

  return (
    <div className={styles.customOption}>
      <div ref={innerRef} {...innerProps} className={styles.optionTitle}>
        <h6 className={styles.title}>{children}</h6>
      </div>
    </div>
  );
};