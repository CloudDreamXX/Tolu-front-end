import { FellBackOption } from "widgets/dayli-journal/ui";

export interface SymptomResponse {
  success: boolean;
  data: SymptomData;
}

export interface MealDetail {
  meal_type: "breakfast" | "lunch" | "dinner";
  food_items: string;
  time: string;
}

export interface SymptomData {
  id?: string;
  user_id?: string;
  tracking_date?: string;
  user_notes?: string;
  symptoms?: string[];
  symptom_intensities?: ("moderate" | "mild" | "severe")[];
  duration_category?: string;
  suspected_triggers?: string[];
  sleep_quality?: "Very Poor" | "Poor" | "Fair" | "Good" | "Very Good";
  sleep_hours?: number;
  sleep_minutes?: number;
  times_woke_up?: number;
  how_fell_asleep?: FellBackOption;
  meal_notes?: string;
  meal_details?: MealDetail[];
}

export interface AiSuggestions {
  suggested_symptoms: string[];
  suggested_triggers: string[];
}
