import { Role } from "../../interfaces/user/user.interface";

interface RoleLimit {
    limit: number;
}

type RoleLimits = {
    [key in Role]: RoleLimit;
};

const roles: RoleLimits = {
    rootAdmin: { limit: 1 },
    adminA: { limit: 10 },
    adminB: { limit: 10 },
    adminC: { limit: 10 },
    subAdmin: { limit: 10 },
    user: {limit: 1},
    guest: {limit: 1},
    marketer: {limit: 1},
};

export const limitedForAdmin = (role: Role): number => {
    return roles[role]?.limit || 0;
};
