import classNames from 'classnames';

export default function Copyright({ className }: { className?: string }) {
  return (
    <span className={classNames('flex flex-row gap-2', className)}>
      <a href='https://calagopus.com' target='_blank' className='underline'>
        Calagopus
      </a>
      &copy; 2025 - {new Date().getFullYear()}
    </span>
  );
}
