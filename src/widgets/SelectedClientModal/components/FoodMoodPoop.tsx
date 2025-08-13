const FoodMoodPoop = () => {
  return (
    <div className="max-w-5xl overflow-hidden rounded-[8px] border border-[#DBDEE1] bg-white">
      <div className="md:max-h-[286px] overflow-y-auto">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-10 bg-[#F3F6FB]">
            <tr className="border-b border-[#DBDEE1]">
              <th className="px-[16px] py-[12px] text-left text-[20px] font-[700] text-[#1C63DB] border-r border-[#F3F6FB] rounded-tl-[8px]">
                Food
              </th>
              <th className="px-[16px] py-[12px] text-left text-[20px] font-[700] text-[#1C63DB] border-r border-[#F3F6FB]">
                Mood
              </th>
              <th className="px-[16px] py-[12px] text-left text-[20px] font-[700] text-[#1C63DB] rounded-tr-[8px]">
                Poop
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Row: Morning */}
            <tr>
              <td className="align-bottom px-[16px] py-[12px] border-b">
                <div className="mb-[4px] text-[12px] font-semibold tracking-wide text-[#5F5F65]">
                  Morning
                </div>
                <div className="text-[14px] text-[#1D1D1F]">
                  Eggs, Avocado, Coffee
                </div>
              </td>
              <td className="align-bottom px-[16px] py-[12px] border-b text-[14px] text-[#1D1D1F]">
                Happy, Energized
              </td>
              <td className="align-bottom px-[16px] py-[12px] border-b border-[#DBDEE1] text-[14px] text-[#1D1D1F]">
                –
              </td>
            </tr>

            {/* Row: Mid-morning */}
            <tr>
              <td className="align-bottom px-[16px] py-[12px] border-b border-[#DBDEE1]">
                <div className="mb-[4px] text-[12px] font-semibold tracking-wide text-[#5F5F65]">
                  Mid-morning
                </div>
                <div className="text-[14px] text-[#1D1D1F]">–</div>
              </td>
              <td className="align-bottom px-[16px] py-[12px] border-b border-[#DBDEE1] text-[14px] text-[#1D1D1F]">
                Slightly Anxious
              </td>
              <td className="align-bottom px-[16px] py-[12px] border-b border-[#DBDEE1] text-[14px] text-[#1D1D1F]">
                2, Soft, Normal
              </td>
            </tr>

            {/* Row: Lunch */}
            <tr>
              <td className="align-bottom px-[16px] py-[12px] border-b border-[#DBDEE1]">
                <div className="mb-[4px] text-[12px] font-semibold tracking-wide text-[#5F5F65]">
                  Lunch
                </div>
                <div className="text-[14px] text-[#1D1D1F]">–</div>
              </td>
              <td className="align-bottom px-[16px] py-[12px] border-b border-[#DBDEE1] text-[14px] text-[#1D1D1F]">
                –
              </td>
              <td className="align-bottom px-[16px] py-[12px] border-b border-[#DBDEE1] text-[14px] text-[#1D1D1F]">
                –
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodMoodPoop;
