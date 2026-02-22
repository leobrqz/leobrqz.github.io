export interface ExperienceEntry {
  title: { en: string; pt: string };
  company: string;
  location: string;
  description: { en: string; pt: string };
}

export const experience: ExperienceEntry[] = [
  {
    title: { en: "Speedrun Ethereum", pt: "Speedrun Ethereum" },
    company: "BuidlGuidl",
    location: "",
    description: {
      en: `- Development of smart contracts in Solidity on Ethereum with practical challenges. Implementation of ERC20, ERC721/ERC1155 (NFTs) patterns, staking, on-chain governance, decentralized marketplaces and DEX.
      - Technologies: Solidity, Scaffold-ETH with HardHat.`,
      pt: `- Desenvolvimento de Smart Contracts em Solidity na Ethereum com desafios práticos. Implementação de padrões ERC20, ERC721/ERC1155 (NFTs), staking, governança on-chain, marketplaces descentralizados e DEX.
      - Tecnologias: Solidity, Scaffold-ETH com HardHat.`,
    },
  },
];
