export const SORT_BY = [
  {
    label: 'Active',
    value: 1,
  },
  {
    label: 'Past',
    value: 2,
  },
  {
    label: 'High Returns',
    value: 3,
  },
] as const;

export type SortValue = (typeof SORT_BY)[number]['value'];
export type SortLabel = (typeof SORT_BY)[number]['label'];

// Helper function to get sort value from label
export const getSortValueFromLabel = (label: string): number => {
  const option = SORT_BY.find(sort => sort.label === label);
  return option?.value || 1; // Default to 1 (Active) if not found
};

// Helper function to get label from sort value
export const getSortLabelFromValue = (value: number): string => {
  const option = SORT_BY.find(sort => sort.value === value);
  return option?.label || 'Active'; // Default to 'Active' if not found
}; 


