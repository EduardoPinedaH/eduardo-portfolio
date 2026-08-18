export const EASE = [0.16, 1, 0.3, 1] as const;

export const SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 24,
  mass: 0.9,
};

export const SPRING_SOFT = {
  type: "spring" as const,
  stiffness: 220,
  damping: 26,
};
