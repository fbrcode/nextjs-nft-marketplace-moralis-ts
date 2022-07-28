# NextJS NFT Marketplace (Moralis)

This project is the frontend part of a web3 fullstack implementation to buy and sell NFTs.

## Project instructions

1. Home Page:
   1. Show recently listed NFTs
      1. If you own the NFT, you can update the listing
      2. If not, you can buy the listing
2. Sell Page:
   1. You can list your NFT in the Marketplace

## Init

`yarn create next-app .`

### Install wallet connection dependencies

`yarn add web3uikit moralis react-moralis`

#### !!Attention

Some newer packages can break your app with **Module no found: `Can't resolve web3kitui`**

Here is package listing that works:

```json
{
  "dependencies": {
    "moralis": "^1.5.11",
    "next": "12.1.5",
    "react": "18.1.0",
    "react-dom": "18.1.0",
    "react-moralis": "^1.3.5",
    "web3uikit": "^0.0.133"
  }
}
```

## Formatting

Tailwind with NextJS: <https://tailwindcss.com/docs/guides/nextjs>

- `yarn add --dev tailwindcss postcss autoprefixer`
- `yarn tailwindcss init -p`
