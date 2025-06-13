export const tableHeaders = [
  { id: 0, title: "Metric" },
  { id: 1, title: "Latest Result" },
  { id: 2, title: "Test date" },
  { id: 3, title: "Status" },
  { id: 4, title: "Lab markers" },
  { id: 5, title: "Functional markers" },
  { id: 6, title: "Comment" },
];

export const tableRows = [
  {
    metric: "Vitamin D",
    LatestResult: "38 ng/mL",
    Testdate: "Apr 20, 2025 8:00 pm",
    Status: "Borderline",
    lab: "25-OH D",
    func: "50–80 ng/mL",
    Comment: "Vitamin D has\n improved 15% since\n last test",
  },
  {
    metric: "Estradiol",
    LatestResult: "72 pg/mL",
    Testdate: "Apr 1, 2025 8:00 pm",
    Status: "Optimal",
    lab: "E2",
    func: "50–150 pg/mL",
    Comment: "Stable over past 3\n months",
  },
  {
    metric: "Glucose (fasted)",
    LatestResult: "112 mg/dL",
    Testdate: "Apr 24, 2025 3:30 pm",
    Status: "Needs Attention",
    lab: "FBG",
    func: "70–99 mg/dL",
    Comment: "Increased 10% —\n consider dietary\n review",
  },
  {
    metric: "hsCRP",
    LatestResult: "2.3 mg/L",
    Testdate: "Apr 27, 2025 4:45 am",
    Status: "Borderline",
    lab: "hsCRP",
    func: "<1.0 mg/L",
    Comment: "Decreased slightly,\n monitor regularly",
  },
  {
    metric: "TSH",
    LatestResult: "1.9 µIU/mL",
    Testdate: "May 6, 2025 3:30 am",
    Status: "Optimal",
    lab: "TSH (Standart)",
    func: "0.5–4.0 µIU/mL",
    Comment: "Consistent with\n previous test",
  },
];

export const statusColors = [
  "#006622", // green
  "#F6B448", // yellow
  "#FF1F0F", // red
];
