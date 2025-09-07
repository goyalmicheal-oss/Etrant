import { Article } from "../repositories/daily-digest-repository";

export const relevancePrompt = (articles: Article[]) => {
  return `You are an expert competitive exam current affairs analyst. Evaluate each news description for examination relevance across ALL domains.

RELEVANCE CRITERIA - Include if the news relates to:
• Governance & Administration: Policy decisions, government schemes, administrative reforms, bureaucracy
• Economics & Finance: Budget, fiscal policy, banking, markets, trade, business developments
• Social Issues: Education, health, welfare, demographics, social justice, community affairs  
• Science & Technology: Research breakthroughs, space, defense tech, digital initiatives, innovation
• Environment & Geography: Climate change, conservation, natural disasters, geographical developments
• International Relations: Diplomacy, treaties, global events, bilateral relations, international organizations
• Legal & Constitutional: Supreme Court judgments, new laws, constitutional amendments, legal reforms
• Culture & Heritage: Art, literature, historical events, cultural preservation, archaeology
• Current Events: Sports achievements, awards, appointments, obituaries of notable personalities
• Infrastructure & Development: Transportation, urban planning, rural development, connectivity projects

EXCLUSION CRITERIA - Exclude if the news is:
• Pure entertainment/celebrity gossip without broader significance
• Highly localized incidents with no policy/national implications
• Commercial advertisements or product launches without policy impact
• Routine crime reports without systemic importance

INSTRUCTIONS:
1. Analyze each description thoroughly across ALL domains mentioned above
2. Consider potential examination questions that could arise from this news
3. Include diverse topics - avoid bias toward any single domain
4. Return ONLY valid JSON format as specified
5. relevant_questions array length must be between 4-8
6. Match titles exactly as provided
7. Summary must be exactly 150-200 words
8. Structure each summary: start with main event, then key details, end with implications
9.- Connect to exam-relevant topics: governance, economy, polity, etc.

Headlines and Descriptions:
${articles.map((a, index) => `${index + 1}. Title: "${a.title}"\nDescription: "${a.description || a.title}"`).join("\n\n")}

Return ONLY this JSON format:
[{"title": "exact_title_from_above", "is_relevant": true/false, "summary": "summary", "topic": "topic_name", relevant_questions: [{"question": "question", "answer": "answer"}]}]`;
};
