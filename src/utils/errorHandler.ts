export function extractGasErrorMessage(err: unknown): string {
    const fallback = "Gas estimation failed";
    if (!(err instanceof Error)) return fallback;
  
    const match = err.message.match(/Error: ([^\[]+)/);
    return match?.[1]?.trim() || fallback;
  }