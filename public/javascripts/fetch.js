async function getData() {
    const url = "https://127.0.0.1:3000/";
    try {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

    } catch (error) {
        console.error(error.message);

    }
}

await getData()