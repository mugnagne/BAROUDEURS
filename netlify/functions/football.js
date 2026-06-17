exports.handler = async function(event, context) {
  const path = event.path;
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing API key" }) };
  }

  try {
    let url = "";

    if (path.endsWith("/fixtures")) {
      url = "https://v3.football.api-sports.io/fixtures?league=1&season=2026";
    } else if (path.match(/\/fixtures\/([0-9]+)$/)) {
      const match = path.match(/\/fixtures\/([0-9]+)$/);
      url = `https://v3.football.api-sports.io/fixtures?id=${match[1]}`;
    } else if (path.match(/\/teams\/([0-9]+)\/form$/)) {
      const match = path.match(/\/teams\/([0-9]+)\/form$/);
      url = `https://v3.football.api-sports.io/teams/statistics?league=1&season=2026&team=${match[1]}`;
    }

    if (!url) {
      return { statusCode: 404, body: JSON.stringify({ error: "Not found", path }) };
    }

    const response = await fetch(url, {
      headers: { "x-apisports-key": apiKey }
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
      }
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: String(error) }) };
  }
};
