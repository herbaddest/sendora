// Tiered fee schedule - more competitive for larger amounts
export function calculateTransferFee(sendAmount: number): number {
  if (sendAmount <= 0) return 0;
  if (sendAmount <= 25) return 0.99;
  if (sendAmount <= 50) return 1.49;
  if (sendAmount <= 100) return 1.99;
  if (sendAmount <= 200) return 2.49;
  if (sendAmount <= 500) return 3.99;
  if (sendAmount <= 1000) return 5.99;
  if (sendAmount <= 2500) return 7.99;
  if (sendAmount <= 5000) return 9.99;
  return 12.99; // $5000+
}

// Get the fee tier description for display
export function getFeeTierLabel(sendAmount: number): string {
  const fee = calculateTransferFee(sendAmount);
  return `$${fee.toFixed(2)}`;
}

// Get all fee tiers for display in a fee schedule
export interface FeeTier {
  min: number;
  max: number | null;
  fee: number;
}

export function getAllFeeTiers(): FeeTier[] {
  return [
    { min: 1, max: 25, fee: 0.99 },
    { min: 25.01, max: 50, fee: 1.49 },
    { min: 50.01, max: 100, fee: 1.99 },
    { min: 100.01, max: 200, fee: 2.49 },
    { min: 200.01, max: 500, fee: 3.99 },
    { min: 500.01, max: 1000, fee: 5.99 },
    { min: 1000.01, max: 2500, fee: 7.99 },
    { min: 2500.01, max: 5000, fee: 9.99 },
    { min: 5000.01, max: null, fee: 12.99 },
  ];
}
