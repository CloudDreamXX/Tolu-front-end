import React from 'react';

const InfoCard = ({ Icon, title, description }) => {
  return (
    <section className="flex items-center gap-2">
      <section>{Icon && <Icon className="text-xl text-[#393838]" />}</section>
      <section>
        <h3 className="text-sm font-semibold text-[#393838]">{title}</h3>
        <p className="text-sm font-medium text-[#1D1D1F80] mt-1">{description}</p>
      </section>
    </section>
  );
};

export default InfoCard;
