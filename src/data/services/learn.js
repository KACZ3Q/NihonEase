const baseUrl = 'https://api.mikorosa.pl';

export async function getAllLearnItems() {
  const url = new URL("/learn/all", baseUrl);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return null;
  }
}
export async function getLearnItemsByCategory(categoryId) {
  const url = new URL(`/learn/category/${categoryId}`, baseUrl);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.json();
  } catch (error) {
    console.error("Get Learn Items By Category Error:", error);
  }
}

export async function getRandomLearnItems(params) {
  const url = new URL(`/learn/pickRandom`, baseUrl);
  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.json();
  } catch (error) {
    console.error("Get Random Learn Items Error:", error);
  }
}
