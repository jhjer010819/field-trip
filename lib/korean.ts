export function hasBatchim(word: string): boolean {
  const trimmed = word.trim();
  if (!trimmed) return false;
  const code = trimmed.charCodeAt(trimmed.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

export function eulReul(word: string): "을" | "를" {
  return hasBatchim(word) ? "을" : "를";
}

export function gwaWa(word: string): "과" | "와" {
  return hasBatchim(word) ? "과" : "와";
}
