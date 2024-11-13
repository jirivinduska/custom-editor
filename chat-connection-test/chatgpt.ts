const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
  // You will need to set these environment variables or edit the following values
  const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://genai-openai-composerbrain.openai.azure.com/";
  const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "af564e78bed7452895952a3384d70690";
  const apiVersion = "2024-05-01-preview";
  const deployment = "gpt-4o"; // This must match your deployment name
  const searchEndpoint = process.env["AZURE_AI_SEARCH_ENDPOINT"] || "https://composer.search.windows.net/";
  const searchKey = process.env["AZURE_AI_SEARCH_API_KEY"] || "i26ISUmFHvmXIpnaZv93B774bH8h7Oi8xD6iqklMulAzSeB0ZTBt";
  const searchIndex = "composer-1";

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

  const result = await client.chat.completions.create({
    messages: [
      {
        role: "system", content: `
Write a comprehensive financial research article based on the provided notes. Ensure the article flows logically and covers all the main points without omitting any crucial details.

# Steps

1. **Introduction**
   - Start by introducing the primary topic or focus of the notes.
   - Provide any necessary background information to set up the article.

2. **Main Body**
   - Break down the notes into key sections or points.
   - Expand on each note, providing explanations, examples, or additional context as needed.
   - Connect the points together to maintain a coherent and logical flow throughout the article.

3. **Conclusion**
   - Summarize the main points covered in the article.
   - Offer any concluding thoughts, implications, or calls to action relevant to the topic.

4. **Disclosures**
   - Provide the standard set of employed analyst and company disclosures.

# Output Format

The article should be structured with clear paragraphs and headings to separate sections. Use subheadings if necessary to enhance readability. Output HTML.

# Notes

- Ensure the information is accurate and aligns with the content provided in the notes.
- Maintain a neutral and informative tone throughout the article.
- The audience is from financial sector.
- Be mindful of any specific terms or jargon that may require definitions or further explanation for clarity.
`},
      {
        role: "user", content: `
Context: I am John Doe, CFA, an analyst attending an earnings call for crayon company named Pencil Castle.
Query: They just increased their production of pencils by 36% and their competitors struggle to catch up because their pencils are not that innovative and they struggle with quality. I think the entire pencils industry is going to grow because demand for pencils increase as children are not allowed to use phones/ipads at kindegarten.
`},

    ],
    max_tokens: 2000,
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null,

    data_sources: [{
        type: "azure_search",
        parameters: {
            endpoint: searchEndpoint,
            key: searchKey,
            index_name: searchIndex,
            authentication: {
              type: "api_key",
              key: searchKey
            }
        }
    }]

  });

  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };