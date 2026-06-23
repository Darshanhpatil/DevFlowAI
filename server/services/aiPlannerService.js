import axios from "axios";

export const generateProjectPlan = async (projectTitle, description) => {
  const prompt = `
Generate a project plan in VALID JSON format only.

Project Title: ${projectTitle}

Description: ${description}

Return exactly this structure:

{
  "overview": "",
  "features": [],
  "techStack": [],
  "databaseTables": [],
  "roadmap": [],
  "deployment": []
}

Do not add markdown.
Do not add explanation.
Return JSON only.
`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.data.choices || !response.data.choices.length) {
    throw new Error(response.data.error?.message || "No AI response received");
  }

  const content = response.data.choices[0].message.content;

  return JSON.parse(content);
};
