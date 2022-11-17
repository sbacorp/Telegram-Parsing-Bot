export const getPrivateChatCommands = () => {

  const commands = [
    {
      command: "start",
      description: "перезапустить бота",
    },
		{
      command: "subs",
      description: "активные подписки",
    }
  ];

  return commands;
};
