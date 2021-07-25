clean = async (text) => {
    if (text && text.constructor.name == "Promise") text = await text;
    if (typeof evaled !== "string") text = require("util").inspect(text, {
        depth: 1
     });
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203) + String.fromCharCode(8203));
  };

  module.exports = clean;