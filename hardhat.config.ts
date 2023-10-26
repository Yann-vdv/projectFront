import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const INFURA_API_KEY = "a0cad0d0d76943c39c8768ef974770ae"

const SEPOLIA_PRIVATE_KEY = "a91bd22ce2cf9d3615d3c9803357490d69b24c6255ea990cf17aa764ab93777b"

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  networks: {
    // hardhat: {
    //   chainId: 1337,
    //   accounts: {
    //     mnemonic: "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
    //   },
    // },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
  },
  paths: {
    artifacts: './frontend/src/artifacts',
  },
};
export default config;