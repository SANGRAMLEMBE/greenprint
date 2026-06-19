// Everything in the engine is calculated in kilograms of CO₂e, but people think
// in tonnes — so almost every screen needs the same "kg → tonnes string"
// conversion. Rather than scatter `(kg / 1000).toFixed(2)` everywhere, it lives
// here once. Default is 2 decimals; pass 1 for the more compact spots.
export function formatTonnes(kg: number, decimals = 2): string {
  return (kg / 1000).toFixed(decimals);
}
