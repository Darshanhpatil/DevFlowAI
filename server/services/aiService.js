import axios from "axios";

export const generateProjectTasks = async (
  projectTitle
) => {
  const prompt = `
Generate 5 project tasks for:

${projectTitle}

Return ONLY JSON array:

[
 {
   "title":"",
   "description":"",
   "status":"Pending"
 }
]
`;

  const response =
    await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model:
          "google/gemma-4-31b-it:free",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json",
        },
      }
    );

    console.log(response.data);

  return response.data.choices[0]
    .message.content;
};