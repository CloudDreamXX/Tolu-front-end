import { Link } from "react-router-dom";

const Notification = () => {
    return (
      <div>
        <h6 className="text-primary text-sm md:text-base font-semibold text-center py-2 border-b">
          Notifications
        </h6>
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <Link className="text-primary text-sm font-semibold text-center py-2 sticky bottom-0 left-0 bg-white block">
          See All Notifications
        </Link>
      </div>
    );
  };

  export default Notification;
  
  const NotificationItem = ({ icon, title, value, time }) => {
    return (
      <div className="flex items-center justify-between gap-4 py-2 px-3 border-b cursor-pointer">
        <div className="flex items-center gap-2">
          <img
            src="https://placehold.co/600x400/18bc9c/000000?text=NT"
            alt="icon"
            className="w-6 h-6 object-cover rounded-full"
          />
          <div>
            <h6 className="text-sm font-medium">Sensors added</h6>
            <p className="text-[10px] text-[#323232e6] font-medium">
              2 sensors added in building one
            </p>
          </div>
        </div>
        <p className="text-[10px] text-[#6e6e6e] font-medium">2 min ago</p>
      </div>
    );
  };