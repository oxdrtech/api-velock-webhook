export const loginsSelectedFields = {
  id: true,
  ipAddress: true,
  date: true,
  playerId: false,
  player: {
    select: {
      id: true,
      externalId: true,
      tenantId: true,
      name: true,
      email: true,
    },
  },
  createdAt: true,
  updatedAt: true
}
