import classNames from 'classnames';

function BadgeTopic({ topic, active, onClick }) {
  return (
    <span
      className={classNames(
        'py-2.5 px-8 rounded-full border border-stroke2 cursor-pointer transition-all',
        active ? 'bg-btnBg text-accent border-btnBg' : ''
      )}
      onClick={onClick}
    >
      {topic}
    </span>
  );
}

export default BadgeTopic;
