export const playersSelectedFields = {
  id: true,
  externalId: true,
  tenantId: true,
  affiliateId: true,
  name: true,
  email: true,
  country: true,
  language: true,
  date: true,
  phoneCountryCode: true,
  phone: true,
  balance: true,
  birthDate: true,
  firstDepositDate: true,
  firstDepositValue: true,
  lastDepositDate: true,
  lastDepositValue: true,
  totalDepositCount: true,
  totalDepositValue: true,
  lastWithdrawalDate: true,
  lastWithdrawalValue: true,
  totalWithdrawalCount: true,
  totalWithdrawalValue: true,
  mostFrequentBetPair: true,
  mostFrequentViewedPair: true,
  lastLoginDate: true,
  lastAccessDate: true,
  playerStatus: true,
  deposits: {
    select: {
      id: true,
      depositStatus: true,
    }
  },
  withdrawals: {
    select: {
      id: true,
    }
  },
  logins: {
    select: {
      id: true,
    }
  },
  createdAt: true,
  updatedAt: true
}
