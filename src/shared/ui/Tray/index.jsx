import classNames from 'classnames';
import TrayCard from './components/TrayCard';

function Tray({ trayItems }) {
  return (
    <div
      className={classNames(
        'flex md:flex-col gap-4 max-h-[82vh] overflow-x-auto md:overflow-x-hidden md:overflow-y-auto pb-2 md:pr-2',
        { 'min-w-[328px] md:max-w-[328px]': trayItems?.length > 0 }
      )}
    >
      {trayItems?.map((item, index) => (
        <TrayCard
          key={index}
          title={item.title}
          topic={item.topic}
          resource={item.resource}
        />
      ))}
    </div>
  );
}

export default Tray;
