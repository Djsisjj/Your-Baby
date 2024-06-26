module.exports = {
  config: {
    name: "slot",
    version: "1.4",
    author: "dipto",
    description: {
      en: "Playing slot game",
    },
    category: "Game",
  },
  langs: {
    en: {
      invalid_amount: "Enter a valid amount of money to play",
      not_enough_money: "Check your balance if you have that amount",
      win_message: "Baby, you won $%1",
      lose_message: "Baby, you lost $%1",
      jackpot_message: "Jackpot! You won $%1 for five %2 symbols of love",
    },
  },
  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["💚","💚","💚","🧡", "❤️", "💜", "💙", "💙", "💙",,"💛","💛", "💙", "💙", "💜", "💜", "❤️", "❤️", "🧡", "🧡", "💚", "💛","❤️", "🧡"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];
    const slot4 = slots[Math.floor(Math.random() * slots.length)];
    const slot5 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = win(slot1, slot2, slot3, slot4, slot5, amount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const messageText = result(slot1, slot2, slot3, slot4, slot5, winnings, getLang);

    return message.reply(messageText);
  },
};

function win(slot1, slot2, slot3, slot4, slot5, betAmount) {
  const slots = [slot1, slot2, slot3, slot4, slot5];
  const uniqueSlots = new Set(slots);
  const matchedCount = (slots.length - uniqueSlots.size) * 2;

  if (matchedCount === 5) {
    if (slot1 === "💚") return betAmount * 20;
    if (slot1 === "💛") return betAmount * 15;
    if (slot1 === "💙") return betAmount * 10; 
    return betAmount * 7; 
  } else if (matchedCount >= 2 || matchedCount <= 4) {
    return betAmount * matchedCount;
  } else {
    return -betAmount;
  }
}

function result(slot1, slot2, slot3, slot4, slot5, winnings, getLang) {
  if (winnings > 0) {
    if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4 && slot4 === slot5) {
      return getLang("jackpot_message", winnings, slot1);
    } else {
      return getLang("win_message", winnings) + ` [ ${slot1} | ${slot2} | ${slot3} | ${slot4} | ${slot5} ]`;
    }
  } else {
    return getLang("lose_message", -winnings) + ` [ ${slot1} | ${slot2} | ${slot3} | ${slot4} | ${slot5} ]`;
  }
  }
