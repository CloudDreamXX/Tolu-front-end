export const stepOneQuestions = [
  {
    id: 0,
    questionType: "text",
    question: "What is your date of birth?",
    type: "date",
    isRequired: true,
  },
  {
    id: 1,
    question: "What gender were you assigned at birth?",
    options: ["Male", "Female", "Prefer not to say"],
    isRequired: true,
  },
  {
    id: 2,
    question: "How do you identify now?",
    options: ["Male", "Female", "Non-binary", "Other"],
    isRequired: true,
  },
  {
    id: 3,
    question: "What pronouns do you use?",
    options: ["she/her", "he/him", "they/them", "other"],
    isRequired: true,
  },
  {
    id: 4,
    question: "What’s your heritage?",
    options: [
      "American Indian",
      "Asian",
      "Black",
      "White",
      "Latinx",
      "Mixed-race",
      "Other",
    ],
    isRequired: true,
  },
  {
    id: 5,
    question: "What’s your primary language?",
    options: ["English", "Spanish", "Other"],
    isRequired: true,
  },
  {
    id: 6,
    question: "What pronouns does your partner use?",
    options: ["she/her", "he/him", "they/them"],
    isRequired: true,
  },
  {
    id: 7,
    question: "Do you have a partner or spouse you’d like to mention?",
    options: ["Yes", "No"],
    isRequired: false,
  },
  {
    id: 8,
    questionType: "text",
    question: "What’s your blood type?",
    placeholder: "O+",
    isRequired: false,
  },

  {
    id: 9,
    questionType: "text",
    question:
      "Do you have any children? If so, how many, and what are their ages?",
    placeholder: "Yes, three kids, ages 8, 5, 2.",
    isRequired: true,
  },
  {
    id: 10,
    questionType: "text",
    question: "Can you tell me your height and current weight?",
    placeholder: "5’8” and 190 lbs",
    isRequired: false,
  },
];

export const stepTwoQuestions = [
  {
    question:
      "Have you experienced any significant health conditions, either in the past or currently?",
    options: ["Diabetes", "thyroid issues", "chronic pain", "allergies"],
    isRequired: true,
  },
  {
    questionType: "text",
    question: "When were these conditions first diagnosed?",
    placeholder: "Diabetes: 2015 , chronic pain: 2020",
    isRequired: false,
  },
  {
    questionType: "text",
    question:
      "Can you describe any treatments, medications, or approaches you’ve used for these conditions?",
    placeholder: "Over-the-counter pain relievers for migraines",
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Have these treatments worked for you? Would you say your symptoms are under control, improving, or worsening?",
    placeholder: "Migraines is under control",

    isRequired: true,
  },

  {
    question: "Have you had any surgeries or significant medical procedures?",
    options: ["Gallbladder removal", "appendectomy", "joint replacement"],
    isRequired: true,
  },

  {
    questionType: "text",
    question:
      "Did you experience any complications or long-term effects from these surgeries?",
    placeholder: "I still occasionally feel digestive discomfort.",
    isRequired: true,
  },
  {
    question:
      "Are there any known health conditions or chronic illnesses in your immediate family?",
    options: [
      "Heart disease",
      "Diabetes,",
      "Autoimmune diseases",
      "Cancer",
      "None",
    ],
    isRequired: true,
  },
  {
    question:
      "Are there any genetic conditions or hereditary diseases in your family?",
    options: [
      "Genetic predisposition to cancer",
      "blood disorders",
      "inherited autoimmune diseases",
    ],
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Have you been tested for any genetic conditions or markers? If so, can you share the results or concerns?",
    placeholder:
      "Yes, I was tested for BRCA1 and BRCA2, and the results were negative.",
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Were there any health issues during your early years, such as frequent illnesses, developmental delays, or other conditions?",
    placeholder:
      "I had frequent ear infections as a child and asthma until I was about 10 years old.",
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Do you know your birth weight or if there were any complications during your birth?",
    placeholder:
      "I was a premature baby, born at 5 pounds, but there were no complications",
    isRequired: false,
  },
  {
    questionType: "text",
    question:
      "Do you have a history of frequent infections, like colds, sinus infections, or UTIs?",
    placeholder:
      "I get colds often during winter and have had a few UTIs in the past year.",
    isRequired: false,
  },

  {
    question: "Have you ever been diagnosed with any chronic infections?",
    options: ["Lyme disease", "Epstein-Barr virus", "others"],
    isRequired: true,
  },
  {
    question: "Do you have any allergies, food sensitivities, or intolerances?",
    options: [
      "Seasonal allergies",
      "gluten intolerance",
      "lactose intolerance",
    ],
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Do you experience any delayed symptoms after eating certain foods, like fatigue, joint pain, or brain fog?",
    placeholder: "Yes, I feel fatigued after eating gluten and dairy.",
    isRequired: true,
  },
  {
    question: "What medications or treatments are you currently taking?",
    options: [
      "Prescription medications",
      "over-the-counter drugs",
      "supplements",
    ],
    isRequired: true,
  },
  {
    questionType: "text",
    question: "Do you take any herbal remedies or alternative therapies?",
    placeholder: "Occasionally, I take ashwagandha for stress.",
    isRequired: true,
  },
  {
    questionType: "text",
    question: "Have you been vaccinated according to standard schedules?",
    placeholder: "Yes, I’ve had all my vaccines.",
    isRequired: false,
  },
  {
    question: "How often have you taken antibiotics throughout your life?",
    options: ["Rarely", "a few times a year", "frequently during childhood"],
    isRequired: true,
  },
];

export const stepThreeQuestions = [
  {
    question:
      "Let’s start with your diet. Are you currently following a specific diet?",
    options: ["Gluten-free", "Keto", "Vegan", "None"],
    isRequired: true,
  },
  {
    question:
      "Do you avoid any specific foods because of how they make you feel?",
    options: ["Sugar in the evening", "dairy causes bloating"],
    isRequired: true,
  },
  {
    question:
      "Do you have any food cravings, and if so, when are they most common?",
    options: ["Sugar causes fatigue", "salty snacks in the afternoon"],
    isRequired: true,
  },
  {
    questionType: "text",
    question: "How many meals or snacks do you typically have in a day?",
    placeholder: "Three meals and one snack.",
    isRequired: true,
  },
  {
    question: "How often do you exercise, and what activities do you enjoy?",
    options: ["Walking", "Yoga", "Cycling", "Gym workouts"],
    isRequired: true,
  },

  {
    questionType: "text",
    question: "Have there been any changes to your activity level recently?",
    placeholder:
      "Reduced activity due to an injury or increased workouts for a fitness goal.",
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Do you have any physical or mental disabilities or limitations you’d like to share?",
    placeholder:
      "Yes, I have limited mobility in my right arm due to an old injury.",

    isRequired: false,
  },

  {
    questionType: "text",
    question: "Does this impact your daily activities or ability to exercise?",
    placeholder: "Yes, I avoid exercises that strain my arm.",
    isRequired: true,
  },
  {
    question:
      "How would you describe your sleep? Are you satisfied with your sleep quality?",
    options: ["Yes", "No", "Sometimes"],
    isRequired: true,
  },

  {
    questionType: "text",
    question: "What time do you usually go to bed and wake up?",
    placeholder: "I go to bed around 11 PM and wake up at 6 AM.",
    isRequired: true,
  },
  {
    questionType: "text",
    question: "Do you wake up during the night or have trouble falling asleep?",
    placeholder:
      "I usually get 7 hours of sleep but wake up once or twice at night.",
    isRequired: true,
  },
  {
    question: "Do you wake up feeling rested?",
    options: ["Yes", "No", "Sometimes"],
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Do you use any sleep aids, like medication, white noise, or herbal teas?",
    placeholder: "I sometimes drink chamomile tea.",
    isRequired: true,
  },
  {
    question:
      "Are there any strategies or routines you use to improve your sleep?",
    options: ["Meditation", "Reading", "limiting screen time"],
    isRequired: true,
  },
  {
    questionType: "text",
    question: "Do you travel frequently for work or leisure?",
    placeholder: "Yes, I travel for work every few weeks.",
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Have you recently returned from a trip? If yes, where did you go, and how did it affect your routine?",
    placeholder:
      "Yes, I just got back from a business trip to New York. It disrupted my sleep and eating schedule.",
    isRequired: true,
  },
  {
    question: "Have you experienced any significant life changes recently?",
    options: [
      "Job change",
      "moving to a new city",
      "loss of a loved one",
      "marriage/divorce",
    ],
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "How has this change impacted your stress levels, routine, or health?",
    placeholder:
      "My stress levels are higher because I’m adjusting to a new environment.",
    isRequired: true,
  },
  {
    question:
      "Understanding your past experiences helps us provide the best support. Have you experienced any form of abuse or trauma in your life?",
    options: [
      "Emotional abuse",
      "physical abuse",
      "discrimination",
      "loss of a loved one",
    ],
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Are there any specific triggers or stressors from these experiences that impact your health today?",
    placeholder:
      "Yes, high-pressure situations remind me of those times and increase my anxiety.",
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "How would you rate your current stress levels on a scale of 1 to 10?",
    placeholder: "(1 = low stress, 10 = very high stress)",
    isRequired: true,
  },
  {
    question: "What are the main sources of stress in your life right now?",
    options: ["Work", "relationships", "finance", "health"],
    isRequired: true,
  },
  {
    question: "What strategies do you use to manage stress?",
    options: ["Meditation", "journaling", "spending time outdoors"],
    isRequired: true,
  },
  {
    questionType: "text",
    question: "Do you have a strong support system of family or friends?",
    placeholder: "Yes, my partner and a few close friends.",
    isRequired: true,
  },

  {
    questionType: "text",
    question:
      "Is there anyone in your life who supports your health and wellness goals?",
    placeholder: "My partner encourages me to eat healthy and exercise.",
    isRequired: true,
  },
  {
    questionType: "text",
    question:
      "Are there any relationships that cause stress or conflict in your life?",
    placeholder: "Yes, occasionally with my siblings..",
    isRequired: true,
  },
];
