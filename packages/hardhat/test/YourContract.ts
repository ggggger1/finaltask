import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";  // Убедитесь, что ваш тип контракта импортирован правильно

describe("YourContract", function () {
  let yourContract: YourContract;
  let owner: any;
  let user: any;

  before(async () => {
    // Получаем аккаунты
    [owner, user] = await ethers.getSigners();
    
    // Получаем фабрику контракта
    const YourContractFactory = await ethers.getContractFactory("YourContract");
    
    // Разворачиваем контракт
    yourContract = await YourContractFactory.deploy(owner.address);
    
    // Контракт уже развернут, проверка его состояния после развертывания
    expect(await yourContract.owner()).to.equal(owner.address);
  });

  // Тесты на развертывание
  describe("Deployment", function () {
    it("Should deploy contract correctly", async function () {
      expect(await yourContract.owner()).to.equal(owner.address);  // Проверка владельца контракта
    });

    it("Should have correct initial state", async function () {
      expect(await yourContract.votingEnded()).to.equal(false);  // Проверка на начальное состояние
      expect(await yourContract.proposal()).to.equal("");  // Проверка на пустое предложение
      expect(await yourContract.totalVotes()).to.equal(0);  // Проверка на начальное количество голосов
    });
  });

  describe("Voting functionality", function () {
    it("Should allow a user to vote", async function () {
      // Устанавливаем предложение для голосования
      await yourContract.connect(owner).setProposal("Proposal 1");

      // Пользователь голосует
      await yourContract.connect(user).vote();
      
      // Проверка, что пользователь проголосовал
      expect(await yourContract.votesForProposal("Proposal 1")).to.equal(1);
      expect(await yourContract.totalVotes()).to.equal(1);
    });

    it("Should prevent a user from voting twice", async function () {
      // Устанавливаем предложение для голосования
      await yourContract.connect(owner).setProposal("Proposal 2");

      // Первый голос
      await yourContract.connect(user).vote();

      // Пытаемся голосовать снова — должно быть отклонено
      await expect(yourContract.connect(user).vote()).to.be.revertedWith("You have already voted.");
    });

    it("Should only allow the owner to end voting", async function () {
      await expect(
        yourContract.connect(user).endVoting()
      ).to.be.revertedWith("Not the Owner");

      await yourContract.connect(owner).endVoting();  // Ожидаем завершение голосования
      expect(await yourContract.votingEnded()).to.equal(true);
    });
  });

  describe("Proposal functionality", function () {
    it("Should allow the owner to set a proposal", async function () {
      await yourContract.connect(owner).setProposal("Proposal 3");
      expect(await yourContract.proposal()).to.equal("Proposal 3");
    });

    it("Should not allow setting a proposal after voting has ended", async function () {
      await yourContract.connect(owner).endVoting();
      await expect(
        yourContract.connect(owner).setProposal("Proposal 4")
      ).to.be.revertedWith("Voting has already ended.");
    });
  });
});
