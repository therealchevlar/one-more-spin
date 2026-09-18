import { SeededRNG } from '../engine/rng';

export function generateRunObituary(
  peakWealth: number,
  decisions: number,
  biggestWin: number,
  biggestMistake: number,
  fatalEventTitle: string = 'a questionable life choice',
  rng: SeededRNG = new SeededRNG()
): string {
  const formatMoney = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
    return `$${Math.round(n)}`;
  };

  const peakStr = formatMoney(peakWealth);

  const funnyPurchases = [
    'Bought an artisanal llama farm.',
    'Purchased a solid-gold espresso machine with titanium piping.',
    'Pre-ordered 400 cases of vintage champagne.',
    'Hired a personal herald to blow a trumpet whenever entering rooms.',
    'Acquired the patent to a proprietary flavor of mayonnaise.',
    'Purchased a slightly used Russian submarine on Telegram.',
    'Commissioned an oil portrait of yourself wrestling a bear.',
    'Donated $500,000 to save the endangered fluorescent tree frog.',
    'Leased a helicopter just to avoid a 4-minute red light.',
    'Bought an unmapped reef in the South Pacific for tax purposes.',
  ];

  const downfallReasons = [
    `Bet it all on ${fatalEventTitle.toLowerCase()}.`,
    `Refused to walk away from ${fatalEventTitle.toLowerCase()}.`,
    `Thought the house edge was a social construct during ${fatalEventTitle.toLowerCase()}.`,
    `Listened to an inner voice whispering "one more spin" during ${fatalEventTitle.toLowerCase()}.`,
    `Told everyone "I literally cannot lose this" before ${fatalEventTitle.toLowerCase()}.`,
  ];

  const epitaphs = [
    'Never financially recovered.',
    'Currently accepting instant ramen donations.',
    'Accountant has fled the country to an unextraditable jurisdiction.',
    'A cautionary tale for business school textbooks.',
    'Died inside, but what an absolute ride.',
    'Will definitely try again tomorrow.',
  ];

  const purchase = rng.pick(funnyPurchases);
  const downfall = rng.pick(downfallReasons);
  const epitaph = rng.pick(epitaphs);

  if (peakWealth > 50_000_000) {
    return `Started with $100.\nReached a god-tier peak of ${peakStr} across ${decisions} decisions.\n${purchase}\n${downfall}\nLost everything.\n${epitaph}`;
  } else if (peakWealth > 1_000_000) {
    return `Started with $100.\nAmassed ${peakStr} in pure swagger.\n${purchase}\n${downfall}\nCollapsed to absolute zero.\n${epitaph}`;
  } else if (peakWealth > 10_000) {
    return `Started with $100.\nPeaked at a respectable ${peakStr}.\n${purchase}\n${downfall}\nBroke as day one.\n${epitaph}`;
  } else {
    return `Started with $100.\nPeaked at ${peakStr} before disaster struck.\nTripped over ${fatalEventTitle.toLowerCase()}.\nLost it all in ${decisions} quick decisions.\n${epitaph}`;
  }
}

export function generateCashOutStory(
  finalWealth: number,
  decisions: number,
  streak: number,
  rng: SeededRNG = new SeededRNG()
): string {
  const formatMoney = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
    return `$${Math.round(n)}`;
  };

  const finalStr = formatMoney(finalWealth);

  const retirementFantasies = [
    'Purchased a secluded villa in Lake Como and spends afternoons sipping vintage Chianti.',
    'Bought a private atoll in French Polynesia and spends mornings teaching parrots to play chess.',
    'Funded a deep-sea marine sanctuary and refuses all phone calls from investment bankers.',
    'Bought a Scottish castle with a private golf course and a helicopter hangar.',
    'Retired to a luxury penthouse in Monaco, watching high-stakes races from the infinity pool.',
    'Spends their days funding indie films and eating at Michelin 3-star restaurants every night.',
  ];

  const victoryQuote = rng.pick(retirementFantasies);

  return `Walked away with ${finalStr} after ${decisions} steel-nerved decisions and a ${streak}-win streak.\n${victoryQuote}\nThe casino management watched you leave in stunned silence.`;
}
