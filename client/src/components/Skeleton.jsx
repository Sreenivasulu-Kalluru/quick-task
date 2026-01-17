import clsx from 'clsx';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={clsx('animate-pulse bg-slate-700/50 rounded-md', className)}
      {...props}
    />
  );
};

export default Skeleton;
