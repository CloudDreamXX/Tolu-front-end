export interface NavigationItem {
  title: string;
  mainLink: string;
  isDisabled?: boolean;
  additionalTitle?: string;
  variant?: "default" | "small";
  links: NavigationInsideItem[];
}

export interface NavigationInsideItem {
  title: string;
  link: string;
  icon?: React.ReactNode;
  titleAdditional?: string;
  isDisabled?: boolean;
}
