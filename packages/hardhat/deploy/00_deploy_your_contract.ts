import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Функция для деплоя контракта YourContract.
 * Здесь указываются адрес деплойера и список кандидатов.
 *
 * @param hre - объект среды выполнения Hardhat.
 */
const deployVoting: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  // Деплоим контракт YourContract с параметрами конструктора
  const deploymentResult = await deploy("YourContract", {
    from: deployer,
    args: [deployer], // Передаем адрес деплойера в конструктор
    log: true,
    autoMine: true, // Автоматически майним транзакцию
  });

  // Получаем развернутый контракт для дальнейшего взаимодействия
  const contractInstance: Contract = await ethers.getContract("YourContract", deployer);
  console.log("📜 Контракт успешно развернут!");
  console.log("📋 Адрес владельца:", deployer);
};

export default deployVoting;

// Добавляем тег для упрощения идентификации задачи при деплое
deployVoting.tags = ["YourContract"];
