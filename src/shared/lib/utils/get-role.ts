export const getUserRole = (roleId: number) => {
  return ["admin", "coaches", "user"][roleId - 1] ?? "guest";
};
