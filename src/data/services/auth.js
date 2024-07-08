const baseUrl = 'https://api.mikorosa.pl';

export async function registerUserService(userData) {
  const url = new URL("/auth/register", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
      cache: "no-cache",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration Service Error:", error);
    return null;
  }
}

export async function loginUserService(userData) {
  const url = new URL("/auth/login", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
      cache: "no-cache",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login Service Error:", error);
    return null;
  }
}
