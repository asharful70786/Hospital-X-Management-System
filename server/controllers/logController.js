import fs from "fs";
import path from "path";

export const getLogs = async (req, res) => {
  try {
    const logPath = path.join(process.cwd(),  "Logger.log"); // Adjust if needed
    const rawData = fs.readFileSync(logPath, "utf-8");

    const lines = rawData.split("\n").filter(line => line.trim() !== "");

    const logs = lines.reverse().slice(0, 100).map(line => {
      const regex = /^(\d{4}-\d{2}-\d{2}T[\d:.]+Z) \[([^\]]+)\] (\w+): (.+)$/;
      const match = line.match(regex);

      if (!match) return { raw: line }; // fallback if it doesn't match

      const [, timestamp, tag, level, message] = match;

      return { timestamp, tag, level, message };
    });

    res.json({ logs });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
