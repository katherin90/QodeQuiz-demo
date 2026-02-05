export const GetData = async () => {
    const res = await fetch('https://quizapi.io/api/v1/questions?category=Next.js', {headers: {"X-Api-Key":'VMKvfMZKPBDTXmBAzw6sI8WkqtekXABe7Oig0uqs'}})
    const data = res.json()
    return data
}